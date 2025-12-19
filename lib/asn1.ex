#!/usr/bin/env elixir

defmodule ASN1 do

  defp emitter() do
    case Application.get_env(:asn1scg, :language, "Swift") do
      "Swift" -> ASN1.Emitters.Swift
      "Rust"  -> ASN1.Emitters.Rust
      _ -> ASN1.Emitters.Swift
    end
  end

  def print(format, params) do
      case :application.get_env(:asn1scg, "save", true) and :application.get_env(:asn1scg, "verbose", false) do
           true -> :io.format(format, params)
              _ -> []
      end
  end

  # array_element_type is helper for strings, kept here? Or used by emitter?
  # It was moved to Emitter.Swift as well. If it's only used for generation, logic belongs there.
  # Checking usage in ASN1... Only in emitSequenceDecoderBodyElementArray which is in Emitter.
  # So I can remove it from ASN1.

  def array(name,type,tag,level \\ "")
  def array(name,type,tag,level) when level == "top" do
       name1 = bin(normalizeName(name))
       type1 = bin(type)
       mod = getEnv(:current_module, "")
       fullName = if mod != "" and not String.starts_with?(name1, "["), do: bin(normalizeName(mod)) <> "_" <> name1, else: name1

       setEnv(name1, fullName)
       setEnv({:array, fullName}, {tag, type1})
       setEnv({:array, "[#{type1}]"}, {tag, type1})

       print "array: #{level} : ~ts = [~ts] ~p (Struct Generated)~n", [name1, type1, tag]

       structDef = emitter().emit_array(fullName, type1, tag, mod)
       save(true, mod, fullName, structDef)
       name1
  end

  def array(name,type,tag,level) when tag == :sequence or tag == :set do
      # This clause is just for side-effects (setEnv and print), used for nested types
      name1 = bin(normalizeName(name))
      type1 = bin(type)
      case level do
           "" -> []
            _ -> print "array: #{level} : ~ts = [~ts] ~p ~n", [name1, type1, tag]
      end
      setEnv(name1, "[#{type1}]")
      mod = getEnv(:current_module, "")
      prefixed = if mod != "" and not String.starts_with?(name1, "["), do: bin(normalizeName(mod)) <> "_" <> name1, else: name1
      setEnv({:array, prefixed}, {tag, type1})
      setEnv({:array, "[#{type1}]"}, {tag, type1})
      name1
  end



  def dump() do
      :lists.foldl(fn {{:array,x},{tag,y}}, _ -> print "env array: ~ts = [~ts] ~tp ~n", [x,y,tag]
                      {x,y}, _  when is_binary(x) -> print "env alias: ~ts = ~ts ~n", [x,y]
                      {{:type,x},_}, _ -> print "env type: ~ts = ... ~n", [x]
                      _, _ -> :ok
      end, [], :lists.sort(:application.get_all_env(:asn1scg)))
  end

  def compile() do
      {:ok, f} = :file.list_dir inputDir()
      :io.format "F: ~p~n", [f]
      files = :lists.filter(fn x -> String.ends_with?(to_string(x), ".asn1") end, f)
      setEnv(:save, false) ; :lists.map(fn file -> compile(false, inputDir() <> to_string(file))  end, files)
      setEnv(:save, false) ; :lists.map(fn file -> compile(false, inputDir() <> to_string(file))  end, files)
      setEnv(:save, true)  ; :lists.map(fn file -> compile(true,  inputDir() <> to_string(file))  end, files)
      print "inputDir: ~ts~n", [inputDir()]
      print "outputDir: ~ts~n", [outputDir()]
      print "coverage: ~tp~n", [coverage()]
      dump()
      emitter().finalize(outputDir())
      :ok
  end

  def coverage() do
         :lists.map(fn x -> :application.get_env(:asn1scg,
              {:trace, x}, []) end,:lists.seq(1,30)) end

  def compile(save, file) do
      tokens = :asn1ct_tok.file file
      {:ok, mod} = :asn1ct_parser2.parse file, tokens
      {:module, _pos, modname, _defid, _tagdefault, _exports, imports, _, declarations} = mod
      setEnv(:current_module, modname)

      # Pre-pass: Register all defined types to support forward references
      :lists.map(fn
         {:typedef,  _, _, name, _} ->
             swiftName = bin(normalizeName(modname)) <> "_" <> bin(normalizeName(name))
             setEnv(name, swiftName)
         {:ptypedef, _, _, name, _args, _} ->
             swiftName = bin(normalizeName(modname)) <> "_" <> bin(normalizeName(name))
             setEnv(name, swiftName)
         {:valuedef, _, _, name, _, _, _} ->
             swiftName = bin(normalizeName(modname)) <> "_" <> bin(normalizeName(name))
             setEnv(name, swiftName)
          _ -> :ok
      end, declarations)

      # Process imports to register external types
      real_imports = case imports do
          {:imports, i} -> i
          i when is_list(i) -> i
          _ -> []
      end

      :io.format("Processing imports for ~p: ~p~n", [modname, real_imports])

      :lists.map(fn import_def ->
          case import_def do
              {:SymbolsFromModule, _, symbols, module, _objid} ->
                  :io.format("Import: module=~p symbols=~p~n", [module, symbols])
                  modName = normalizeName(importModuleName(module))
                  :lists.map(fn
                      {:Externaltypereference, _, _, type} ->
                          swiftName = bin(modName) <> "_" <> bin(normalizeName(type))
                          setEnvGlobal(type, swiftName)
                      {:Externalvaluereference, _, _, val} ->
                          swiftName = bin(modName) <> "_" <> bin(normalizeName(val))
                          :io.format("Import Value: ~p (~p) -> ~ts~n", [val, is_atom(val), swiftName])
                          setEnvGlobal(val, swiftName)
                      _ -> :ok
                  end, symbols)
              _ -> :ok
          end
      end, real_imports)

      :lists.map(fn
         {:typedef,  _, pos, name, type} ->
             # Check if there's a ptype definition for this type (e.g. Context)
             sname = to_string(name)
             ptypes = Application.get_env(:asn1scg, :ptypes, %{})
             case Map.get(ptypes, sname) do
                 nil -> compileType(pos, name, type, modname, save)
                 definition ->
                     gen_type = build_ptype_ast(pos, definition, modname)
                     compileType(pos, name, gen_type, modname, save)
             end
         {:ptypedef, _, pos, name, args, type} -> compilePType(pos, name, args, type)
         {:classdef, _, pos, name, mod, type} -> compileClass(pos, name, mod, type)
         {:valuedef, _, pos, name, type, value, mod} -> compileValue(pos, name, type, value, mod)
      end, declarations)

  end

  def compileClass(_pos, name, modname, _type) do
      # Add _Class suffix to avoid collision with regular types (e.g., CONTEXT class vs Context type)
      swiftName = bin(normalizeName(modname)) <> "_" <> bin(normalizeName(name)) <> "_Class"
      setEnv(name, swiftName)
      content = emitter().emit_typealias(swiftName, "ASN1Any", modname)
      save(true, modname, swiftName, content)
  end

  def compileType(pos, name, typeDefinition, modname, save \\ true) do
      res = case typeDefinition do
          {:type, _, {:"INTEGER", cases}, _, _, :no} ->  setEnv(name, "Int") ; integerEnum(name, cases, modname, save)
          {:type, _, {:"ENUMERATED", cases}, _, _, :no} -> enumeration(name, cases, modname, save)
          {:type, _, {:"CHOICE", cases}, _, _, :no} -> choice(name, cases, modname, save)
          {:type, _, {:"SEQUENCE", _, _, _, fields}, _, _, :no} -> sequence(name, fields, modname, save)
          {:type, _, {:"Sequence", _, _, _, fields}, _, _, :no} -> sequence(name, fields, modname, save)
          {:type, _, {:"SET", _, _, _, fields}, _, _, :no} -> set(name, fields, modname, save)
          {:type, _, {:"Set", _, _, _, fields}, _, _, :no} -> set(name, fields, modname, save)
          {:type, _, {:"SEQUENCE OF", {:type, _, type, _, _, :no}}, _, _, _} when is_atom(type) -> array(name,emitter().substitute_type(lookup(bin(type))),:sequence,"top")
          {:type, _, {:"Sequence Of", {:type, _, type, _, _, :no}}, _, _, _} when is_atom(type) -> array(name,emitter().substitute_type(lookup(bin(type))),:sequence,"top")
          {:type, _, {:"SEQUENCE OF", {:type, _, {:pt, {:Externaltypereference, _, _, pt_type}, _}, _, _, :no}}, _, _, _} -> array(name, emitter().substitute_type(lookup(bin(pt_type))), :sequence, "top")
          {:type, _, {:"Sequence Of", {:type, _, {:pt, {:Externaltypereference, _, _, pt_type}, _}, _, _, :no}}, _, _, _} -> array(name, emitter().substitute_type(lookup(bin(pt_type))), :sequence, "top")
          {:type, _, {:"SEQUENCE OF", {:type, _, {_, _, _, type}, _, _, _}}, _, _, _} -> array(name,emitter().substitute_type(lookup(bin(type))),:sequence,"top")
          {:type, _, {:"Sequence Of", {:type, _, {_, _, _, type}, _, _, _}}, _, _, _} -> array(name,emitter().substitute_type(lookup(bin(type))),:sequence,"top")
          {:type, _, {:"SET OF", {:type, _, type, _, _, :no}}, _, _, _} when is_atom(type) -> array(name,emitter().substitute_type(lookup(bin(type))),:set,"top")
          {:type, _, {:"Set Of", {:type, _, type, _, _, :no}}, _, _, _} when is_atom(type) -> array(name,emitter().substitute_type(lookup(bin(type))),:set,"top")
          {:type, _, {:"SET OF", {:type, _, {:pt, {:Externaltypereference, _, _, pt_type}, _}, _, _, :no}}, _, _, _} -> array(name, emitter().substitute_type(lookup(bin(pt_type))), :set, "top")
          {:type, _, {:"Set Of", {:type, _, {:pt, {:Externaltypereference, _, _, pt_type}, _}, _, _, :no}}, _, _, _} -> array(name, emitter().substitute_type(lookup(bin(pt_type))), :set, "top")
          {:type, _, {:"SET OF", {type, _, {_, _, _, type}, _, _, _}}, _, _, _} -> array(name,emitter().substitute_type(lookup(bin(type))),:set,"top")
          {:type, _, {:"SEQUENCE OF", {:type, _, {:SEQUENCE, _, _, _, fields}, _, _, :no}}, _, _, _} ->
              # e.g. PollReqContent ::= SEQUENCE OF SEQUENCE { ... }
              element_name = bin(name) <> "_Element"
              sequence(element_name, fields, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :sequence, "top")
          {:type, _, {:"Sequence Of", {:type, _, {:SEQUENCE, _, _, _, fields}, _, _, :no}}, _, _, _} ->
              element_name = bin(name) <> "_Element"
              sequence(element_name, fields, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :sequence, "top")
          {:type, _, {:"Set Of", {type, _, {_, _, _, type}, _, _, _}}, _, _, _} -> array(name,emitter().substitute_type(lookup(bin(type))),:set,"top")
          {:type, _, {:"SET OF", {:type, _, {:SET, _, _, _, fields}, _, _, :no}}, _, _, _} ->
              # e.g. Local-File-References ::= SET OF SET { ... }
              element_name = bin(name) <> "_Element"
              set(element_name, fields, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :set, "top")
          {:type, _, {:"Set Of", {:type, _, {:SET, _, _, _, fields}, _, _, :no}}, _, _, _} ->
              element_name = bin(name) <> "_Element"
              set(element_name, fields, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :set, "top")
          {:type, _, {:"Set Of", {:type, _, {:"Set Of", inner_type}, _, _, :no}}, _, _, _} ->
              # e.g. alternative-feature-sets ::= Set Of Set Of OBJECT IDENTIFIER
              element_name = bin(name) <> "_Element"
              array(element_name, emitter().substitute_type(lookup(bin(inner_type))), :set, "nested")
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :set, "top")
          {:type, _, {:"SET OF", {:type, _, {:"SET OF", inner_type}, _, _, :no}}, _, _, _} ->
              # e.g. alternative-feature-sets ::= SET OF SET OF OBJECT IDENTIFIER
              element_name = bin(name) <> "_Element"
              array(element_name, emitter().substitute_type(lookup(bin(inner_type))), :set, "nested")
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :set, "top")
          {:type, _, {:"SET OF", {:type, _, {:SEQUENCE, _, _, _, fields}, _, _, :no}}, _, _, _} ->
              # e.g. Sealed-Doc-Bodyparts ::= SET OF SEQUENCE { ... }
              element_name = bin(name) <> "_Element"
              sequence(element_name, fields, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :set, "top")
          {:type, _, {:"Set Of", {:type, _, {:SEQUENCE, _, _, _, fields}, _, _, :no}}, _, _, _} ->
              element_name = bin(name) <> "_Element"
              sequence(element_name, fields, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :set, "top")
          {:type, _, {:"SET OF", {:type, _, {_, _, _, type}, _, _, _}}, _, _, _} ->
              if bin(name) == "alternative-feature-sets" do
                :io.format("DEBUG alternative-feature-sets matched general SET OF: type=~p~n", [type])
              end
              array(name,emitter().substitute_type(lookup(bin(type))),:set,"top")
          {:type, _, {:"Set Of", {:type, _, {_, _, _, type}, _, _, _}}, _, _, _} -> array(name,emitter().substitute_type(lookup(bin(type))),:set,"top")

          {:type, _, {:"SEQUENCE OF", inner_type_def}, _, _, _} ->
              element_name = bin(name) <> "_Element"
              setEnv(name, element_name)
              compileType(pos, element_name, inner_type_def, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :sequence, "top")
          {:type, _, {:"Sequence Of", inner_type_def}, _, _, _} ->
              element_name = bin(name) <> "_Element"
              setEnv(name, element_name)
              compileType(pos, element_name, inner_type_def, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :sequence, "top")
          {:type, _, {:"SET OF", inner_type_def}, _, _, _} ->
              element_name = bin(name) <> "_Element"
              setEnv(name, element_name)
              compileType(pos, element_name, inner_type_def, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :set, "top")
          {:type, _, {:"Set Of", inner_type_def}, _, _, _} ->
              element_name = bin(name) <> "_Element"
              setEnv(name, element_name)
              compileType(pos, element_name, inner_type_def, modname, save)
              element_swift = getSwiftName(element_name, modname)
              array(name, element_swift, :set, "top")

          {:type, _, {:pt, {:Externaltypereference, _, _pt_mod, :'SIGNED'}, [innerType]}, _, [], :no} ->
              tbsName = bin(name) <> "_toBeSigned"
              compileType(pos, tbsName, innerType, modname, save)

              fields = [
                  {:ComponentType, pos, :toBeSigned, {:type, [], {:Externaltypereference, pos, modname, tbsName}, [], [], :no}, [], [], []},
                  {:ComponentType, pos, :algorithmIdentifier, {:type, [], {:Externaltypereference, pos, modname, :'AlgorithmIdentifier'}, [], [], :no}, [], [], []},
                  {:ComponentType, pos, :encrypted, {:type, [], :'BIT STRING', [], [], :no}, [], [], []}
              ]
              sequence(name, fields, modname, save)

          {:type, _, {:pt, {:Externaltypereference, _, pt_mod, pt_type}, args}, _, [], :no} ->
              # Look up parameterized type definition for expansion
              ptype_def = :application.get_env(:asn1scg, {:ptype_def, pt_mod, pt_type}, nil)
              # Check if this is a simple type parameter (not IOC-based)
              has_simple_params = case ptype_def do
                  nil -> false
                  {param_names, _} ->
                      # Only expand if we have simple type parameters (single Externaltypereference)
                      Enum.all?(param_names, fn
                          {:Externaltypereference, _, _, _} -> true
                          _ -> false
                      end)
              end

              case ptype_def do
                  nil ->
                      # Fallback: create typealias to substituted type
                      swiftName = getSwiftName(name, modname)
                      setEnv(name, swiftName)
                      target = emitter().substitute_type(lookup(bin(pt_type)))
                      content = emitter().emit_typealias(swiftName, target, modname)
                      save(save, modname, swiftName, content)
                  {_param_names, _template_type} when not has_simple_params ->
                      # Complex IOC-based type - fallback to typealias
                      swiftName = getSwiftName(name, modname)
                      setEnv(name, swiftName)
                      target = emitter().substitute_type(lookup(bin(pt_type)))
                      content = emitter().emit_typealias(swiftName, target, modname)
                      save(save, modname, swiftName, content)
                  {param_names, template_type} ->
                      # Expand parameterized type with actual arguments
                      expanded_type = expand_ptype(template_type, param_names, args)
                      compileType(pos, name, expanded_type, modname, save)
              end


          {:type, _, {:"BIT STRING",_}, _, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "BIT STRING", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'BIT STRING', _, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "BIT STRING", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'INTEGER', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "INTEGER", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'NULL', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "NULL", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'ANY', _set, [], :no} -> setEnv(name, "ANY")
          {:type, _, :'OBJECT IDENTIFIER', _set, _constraints, :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              setEnv({:is_oid, swiftName}, true)
              content = emitter().emit_typealias(swiftName, "OBJECT IDENTIFIER", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'External', _set, [], :no} -> setEnv(name, "EXTERNAL")
          {:type, _, :'PrintableString', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "PrintableString", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'PrintableString', _set, _constraints, :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "PrintableString", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'NumericString', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "NumericString", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'NumericString', _set, _constraints, :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "NumericString", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'IA5String', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "IA5String", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'TeletexString', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "TeletexString", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'UniversalString', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "UniversalString", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'UTF8String', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "UTF8String", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'VisibleString', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "VisibleString", modname)
              save(save, modname, swiftName, content)
          {:type, _, :'BMPString', _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "BMPString", modname)
              save(save, modname, swiftName, content)
          {:type, _, {:Externaltypereference, _, _, ext}, _set, [], :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              target = emitter().substitute_type(lookup(bin(ext)))
              if getEnv({:is_oid, target}, false) or target == "OBJECT IDENTIFIER" do
                 setEnv({:is_oid, swiftName}, true)
              end
              content = emitter().emit_typealias(swiftName, target, modname)
              save(save, modname, swiftName, content)
          {:type, _, {:Externaltypereference, _, _, ext}, _set, _constraints, :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              target = emitter().substitute_type(lookup(bin(ext)))
              if getEnv({:is_oid, target}, false) or target == "OBJECT IDENTIFIER" do
                 setEnv({:is_oid, swiftName}, true)
              end
              content = emitter().emit_typealias(swiftName, target, modname)
              save(save, modname, swiftName, content)
          {:type, _, type, _set, [], :no} when is_atom(type) ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              target = emitter().substitute_type(lookup(bin(type)))
              content = emitter().emit_typealias(swiftName, target, modname)
              save(save, modname, swiftName, content)
          {:type, _, type, _set, [], :no} when is_list(type) ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              target = emitter().substitute_type(lookup(bin(type)))
              content = emitter().emit_typealias(swiftName, target, modname)
              save(save, modname, swiftName, content)
          {:type, _, type, _set, _constraints, :no} when is_list(type) ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              target = emitter().substitute_type(lookup(bin(type)))
              content = emitter().emit_typealias(swiftName, target, modname)
              save(save, modname, swiftName, content)
          {:type, _, {:ObjectClassFieldType, _, _class, [{:valuefieldreference, :id}], _}, _, _, :no} ->
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              setEnv({:is_oid, swiftName}, true)
              content = emitter().emit_typealias(swiftName, "OBJECT IDENTIFIER", modname)
              save(save, modname, swiftName, content)
          {:type, _, {:ObjectClassFieldType, _, _class, _field, _} = _type_def, _, _, :no} ->
              # TYPE-IDENTIFIER.&Type patterns -> ANY typealias
              swiftName = getSwiftName(name, modname)
              setEnv(name, swiftName)
              content = emitter().emit_typealias(swiftName, "ANY", modname)
              save(save, modname, swiftName, content)

          {:type, _, {:pt, _, _}, _, [], _} -> :ignore
          {:Object, _, _val} -> :ignore
          {:Object, _, _, _} -> :ignore
          {:ObjectSet, _, _, _, _} -> :ignore
          _ -> :skip
      end
      case res do
           :skip -> :io.format("Unhandled type definition ~p: ~p~n", [name, typeDefinition])
           :ignore -> :skip
               _ -> :skip
      end
  end

  def extractOIDList(val) do
      # :io.format("DEBUG extractOIDList: ~p~n", [val])
      list = if is_list(val), do: val, else: [val]
      Enum.flat_map(list, fn x ->
         if x == :'id-at' or (is_tuple(x) and elem(x, 0) == :Externalvaluereference and elem(x, 3) == :'id-at') do
             :io.format("DEBUG extractOIDList id-at component: ~p~n", [x])
         end
         resolveOIDComponent(x)
      end)
  end

  def resolveOIDComponent({:NamedNumber, _, val}), do: resolveOIDComponent(val)
  def resolveOIDComponent({:seqtag, _, mod, name}) do
      # Reference to a value in a module - check if imported, otherwise use module prefix
      swift_name = case lookup(name) do
          val when is_binary(val) -> val
          _ -> bin(normalizeName(mod)) <> "_" <> bin(normalizeName(name))
      end
      [swift_name]
  end
  def resolveOIDComponent({{:seqtag, _, mod, name}, val}) do
      # Tuple of (reference, value) - resolve the reference and append the numeric value
      swift_name = case lookup(name) do
          found when is_binary(found) -> found
          _ -> bin(normalizeName(mod)) <> "_" <> bin(normalizeName(name))
      end
      [swift_name | resolveOIDComponent(val)]
  end

  def resolveOIDComponent({:Externalvaluereference, _, _, :'joint-iso-itu-t'}), do: ["2"]
  def resolveOIDComponent({:Externalvaluereference, _, _, :'joint-iso-ccitt'}), do: ["2"]
  def resolveOIDComponent({:Externalvaluereference, _, _, :iso}), do: ["1"]
  def resolveOIDComponent({:Externalvaluereference, _, _, :'itu-t'}), do: ["0"]
  def resolveOIDComponent({:Externalvaluereference, _, _, :ccitt}), do: ["0"]
  def resolveOIDComponent({:Externalvaluereference, _, mod, name}) do
      current = getEnv(:current_module, "")
      res = if normalizeName(mod) == normalizeName(current) do
          case lookup(name) do
             val when is_binary(val) -> val
             _ -> bin(normalizeName(mod)) <> "_" <> bin(normalizeName(name))
          end
      else
          bin(normalizeName(mod)) <> "_" <> bin(normalizeName(name))
      end
      [res]
  end

  def resolveOIDComponent(:'joint-iso-itu-t'), do: ["2"]
  def resolveOIDComponent(:'joint-iso-ccitt'), do: ["2"]
  def resolveOIDComponent(:iso), do: ["1"]
  def resolveOIDComponent(:'itu-t'), do: ["0"]
  def resolveOIDComponent(:ccitt), do: ["0"]

  def resolveOIDComponent(val) when is_atom(val) do
      res = case lookup(val) do
          :undefined -> val
          found -> found
      end
      if val == :'id-at' do
         :io.format("DEBUG resolveOIDComponent id-at: ~p -> ~p~n", [val, res])
      end
      [res]
  end

  def resolveOIDComponent(val), do: [val]

  def value(name, _type, val, modname, saveFlag) do
      swiftName = getSwiftName(name, modname)
      setEnv(name, swiftName)
      shortName = bin(normalizeName(name))

      components = extractOIDList(val)

      # Check if first component is likely a variable (starts with letter)
      # We rely on the fact that variables in our generation start with uppercase or are atoms resolved to strings.
      # Integers are strings of digits.

      {base, suffix} = case components do
          [h | t] ->
             # If h is a variable name (like "UsefulDefinitions_module"), it won't be numeric.
             # If h is "2", it is numeric.
             if Regex.match?(~r/^\d+$/, to_string(h)) do
                 {nil, components}
             else
                 {h, t}
             end
          [] -> {nil, []}
      end

      definition = cond do
        base && suffix == [] ->
            "public let #{shortName}: ASN1ObjectIdentifier = #{base}"
        base ->
            suffix_str = Enum.join(suffix, ", ")
            "public let #{shortName}: ASN1ObjectIdentifier = #{base} + [#{suffix_str}]"
        true ->
            oid_str = Enum.join(components, ", ")
            "public let #{shortName}: ASN1ObjectIdentifier = [#{oid_str}]"
    end

      content = emitter().emit_oid_value(swiftName, definition, modname)
      save(saveFlag, modname, swiftName <> "_oid", content)
  end

    def resolve_value({:Externalvaluereference, _, mod, name}) do
      # Try to lookup using just name first (local alias)
      res = lookup(bin(name))
      if res != :undefined and res != bin(name) do
          res
      else
          # Fallback to fully qualified name
          bin(normalizeName(mod)) <> "_" <> bin(normalizeName(name))
      end
  end
  def resolve_value(val), do: val

  def compileValue(_pos, name, {:type, [], :'INTEGER', [], [], :no}, val, mod) do
      swiftName = getSwiftName(name, mod)
      setEnv(name, swiftName)
      resolved_val = resolve_value(val)
      content = emitter().emit_constant(swiftName, resolved_val, mod)
      save(true, mod, swiftName, content)
  end

  def compileValue(_pos, name, {:type, [], :'OBJECT IDENTIFIER', [], [], :no} = type, val, mod), do: value(name, type, val, mod, true)

  def compileValue(_pos, name, {:type, [], :'NULL', [], [], :no}, _val, mod) do
      swiftName = getSwiftName(name, mod)
      setEnv(name, swiftName)
      content = emitter().emit_constant(swiftName, "ASN1Null()", mod, "ASN1Null")
      save(true, mod, swiftName, content)
  end

  def compileValue(_pos, name, {:type, [], :'OCTET STRING', [], [], :no}, {:hstring, chars}, mod) do
      swiftName = getSwiftName(name, mod)
      setEnv(name, swiftName)
      # Parse hex string to array of bytes
      bytes = parse_hex_string(chars)
      content = emitter().emit_constant(swiftName, bytes, mod, "ASN1OctetString")
      save(true, mod, swiftName, content)
  end

  def compileValue(_pos, name, {:type, _, {:Externaltypereference, _, _, ref}, _, _, _} = type, val, mod) do
      resolved = lookup(bin(ref))
      cond do
          resolved == "ASN1ObjectIdentifier" or resolved == "OBJECT IDENTIFIER" or getEnv({:is_oid, resolved}, false) ->
              value(name, type, val, mod, true)
          resolved == "ASN1OctetString" or resolved == "OCTET STRING" ->
             case val do
                 {_, chars} -> # hstring or similar
                     swiftName = getSwiftName(name, mod)
                     setEnv(name, swiftName)
                     bytes = parse_hex_string(chars)
                     content = emitter().emit_constant(swiftName, bytes, mod, "ASN1OctetString")
                     save(true, mod, swiftName, content)
                 _ ->
                     :io.format("Unhandled OCTET STRING value definition ~p : ~p = ~p ~n", [name, type, val])
                     []
             end
          resolved == "ASN1Null" or resolved == "NULL" ->
              swiftName = getSwiftName(name, mod)
              setEnv(name, swiftName)
              content = emitter().emit_constant(swiftName, "ASN1Null()", mod, "ASN1Null")
              save(true, mod, swiftName, content)
          resolved == "Int" ->
              swiftName = getSwiftName(name, mod)
              setEnv(name, swiftName)
              resolved_val = resolve_value(val)
              content = emitter().emit_constant(swiftName, resolved_val, mod)
              save(true, mod, swiftName, content)
          true ->
              # Ignore other complex values for now (like defaultPBKDF2)
              # :io.format("Ignored value definition ~p : ~p = ~p ~n", [name, type, val])
              []
      end
  end

  def compileValue(_pos, _name, {:type, [], {:pt, _, _}, [], [], :no}, _val, _mod), do: []
  def compileValue(_pos, name, type, val, _mod), do: (:io.format("Unhandled value definition ~p : ~p = ~p ~n", [name, type, val]) ; [])

  def parse_hex_string(chars) do
      str = to_string(chars)
      # Assuming chars is a charlist or string like "0500"
      str = String.replace(str, ~r/[^0-9A-Fa-f]/, "") # Remove spaces/newlines if any
      bytes = for <<high::8, low::8 <- str>>, do: List.to_integer([high, low], 16)
      "[" <> Enum.join(Enum.map(bytes, fn b -> "0x" <> Base.encode16(<<b::8>>, case: :lower) end), ", ") <> "]"
  end

  def compilePType(pos, name, args, type) do
      sname = to_string(name)
      ptypes = Application.get_env(:asn1scg, :ptypes, %{})

      # Store parameterized type definition for later expansion
      if args != [] do
          modname = getEnv(:current_module, "")
          key = {:ptype_def, modname, name}
          :application.set_env(:asn1scg, key, {args, type})
      end

      case Map.get(ptypes, sname) do
         nil ->
             if args != [], do: :skip, else: compileType(pos, name, type, getEnv(:current_module, ""), true)
         definition ->
             modname = getEnv(:current_module, "")
             gen_type = build_ptype_ast(pos, definition, modname)
             compileType(pos, name, gen_type, modname, true)
      end
  end

  defp build_ptype_ast(pos, {:sequence, fields}, mod) do
      new_fields = Enum.map(fields, fn {name, type, opts} ->
          build_component(pos, name, type, opts, mod)
      end)
      {:type, [], {:SEQUENCE, [], [], [], new_fields}, [], [], :no}
  end

  defp build_ptype_ast(pos, {:choice, cases}, mod) do
      new_cases = Enum.map(cases, fn {name, type} ->
          type_ast = build_type_ast(pos, type, [], mod)
          {:ComponentType, pos, name, type_ast, [], [], []}
      end)
      {:type, [], {:CHOICE, new_cases}, [], [], :no}
  end

  defp build_ptype_ast(pos, {:set_of, type}, mod) do
      type_ast = build_type_ast(pos, type, [], mod)
      {:type, [], {:"SET OF", type_ast}, [], [], :no}
  end

  defp build_ptype_ast(pos, {:sequence_of, type}, mod) do
      type_ast = build_type_ast(pos, type, [], mod)
      {:type, [], {:"SEQUENCE OF", type_ast}, [], [], :no}
  end

  defp build_ptype_ast(pos, type_atom, mod) when is_atom(type_atom) do
      build_type_ast(pos, type_atom, [], mod)
  end

  defp build_component(pos, name, type, opts, mod) do
      tags = Keyword.get(opts, :tag)
      attrs = if tags do
           {cls, num, method} = tags
           cls_atom = cls |> to_string |> String.upcase |> String.to_atom
           method_atom = method |> to_string |> String.upcase |> String.to_atom
           [{:tag, cls_atom, num, method_atom, nil}]
      else
           []
      end

      optional = if Keyword.get(opts, :optional), do: :OPTIONAL, else: []

      type_ast = build_type_ast(pos, type, attrs, mod)
      {:ComponentType, pos, name, type_ast, optional, [], []}
  end

  defp build_type_ast(_pos, :oid, attrs, _mod), do: {:type, attrs, :'OBJECT IDENTIFIER', [], [], :no}
  defp build_type_ast(_pos, :any, attrs, _mod), do: {:type, attrs, :'ANY', [], [], :no}
  defp build_type_ast(_pos, :boolean, attrs, _mod), do: {:type, attrs, :'BOOLEAN', [], [], :no}
  defp build_type_ast(_pos, :octet_string, attrs, _mod), do: {:type, attrs, :'OCTET STRING', [], [], :no}
  defp build_type_ast(_pos, :bit_string, attrs, _mod), do: {:type, attrs, :'BIT STRING', [], [], :no}
  defp build_type_ast(pos, {:set_of, type}, attrs, mod), do: {:type, attrs, {:"SET OF", build_type_ast(pos, type, [], mod)}, [], [], :no}
  defp build_type_ast(pos, {:sequence_of, type}, attrs, mod), do: {:type, attrs, {:"SEQUENCE OF", build_type_ast(pos, type, [], mod)}, [], [], :no}
  defp build_type_ast(pos, {:external, ref_name}, attrs, mod), do: {:type, attrs, {:Externaltypereference, pos, mod, String.to_atom(ref_name)}, [], [], :no}
  defp build_type_ast(_pos, atom, attrs, _mod) when is_atom(atom), do: {:type, attrs, atom, [], [], :no}

  # Parameterized type expansion helpers
  defp expand_ptype(template_type, param_names, args) do
      # Extract parameter name atoms from various structures
      param_name_atoms = Enum.map(param_names, fn
          # Simple type parameter with external reference
          {:Externaltypereference, _, _, pname} -> pname

          # Parameter wrapped in Parameter node
          {:Parameter, _, {:Externaltypereference, _, _, pname}} -> pname
          {:Parameter, _, pname} when is_atom(pname) -> pname

          # IOC pattern: {ClassType, IOSet} - extract the IOSet name
          {{:type, _, {:Externaltypereference, _, _, _class}, _, _, _}, {:Externaltypereference, _, _, ioset_name}} ->
              ioset_name

          # IOC pattern with INTEGER type (for SIZE constraints)
          {{:type, _, :INTEGER, _, _, _}, {:Externalvaluereference, _, _, value_name}} ->
              value_name

          other -> other
      end)

      # Extract argument types from args (could be keyword list or list of types)
      arg_types = Enum.map(args, fn
          # Handle valueset patterns
          {:valueset, {:element_set, type, _}} -> type
          # Handle direct type references
          {:Externaltypereference, _, _, _} = t -> t
          {:type, _, _, _, _, _} = t -> t
          # Handle keyword list entries
          {_key, value} when is_tuple(value) -> value
          other -> other
      end)

      substitutions = Enum.zip(param_name_atoms, arg_types) |> Map.new()

      # Recursively substitute parameter references in the template
      substitute_params(template_type, substitutions)
  end


  defp substitute_params({:type, attrs, inner, a, b, c}, subs) do
      {:type, attrs, substitute_params(inner, subs), a, b, c}
  end

  defp substitute_params({:Externaltypereference, pos, mod, ref}, subs) do
      case Map.get(subs, ref) do
          nil -> {:Externaltypereference, pos, mod, ref}
          replacement -> replacement
      end
  end

  defp substitute_params({tag, elements}, subs) when is_list(elements) and is_atom(tag) do
      {tag, Enum.map(elements, &substitute_params(&1, subs))}
  end

  defp substitute_params({:SEQUENCE, a, b, c, elements}, subs) do
      {:SEQUENCE, a, b, c, Enum.map(elements, &substitute_params(&1, subs))}
  end

  defp substitute_params({:ComponentType, pos, name, type, opt, a, b}, subs) do
      {:ComponentType, pos, name, substitute_params(type, subs), opt, a, b}
  end

  defp substitute_params(other, _subs), do: other

  def getSwiftName(name, modname) do
      nname = bin(normalizeName(name))
      nmod = bin(normalizeName(modname))
      nmod <> "_" <> nname
  end

  def sequence(name, fields, modname, saveFlag) do
      swiftName = getSwiftName(name, modname)
      setEnv(name, swiftName)
      setEnv(:current_struct, swiftName)
      :application.set_env(:asn1scg, {:type,swiftName}, fields)
      content = emitter().emit_sequence(swiftName, fields, modname)
      save(saveFlag, modname, swiftName, content)
  end

  def set(name, fields, modname, saveFlag) do
      swiftName = getSwiftName(name, modname)
      setEnv(name, swiftName)
      setEnv(:current_struct, swiftName)
      :application.set_env(:asn1scg, {:type,swiftName}, fields)
      content = emitter().emit_set(swiftName, fields, modname)
      save(saveFlag, modname, swiftName, content)
  end

  def choice(name, cases, modname, saveFlag) do
      swiftName = getSwiftName(name, modname)
      setEnv(name, swiftName)
      content = emitter().emit_choice(swiftName, cases, modname)
      save(saveFlag, modname, swiftName, content)
  end

  def enumeration(name, cases, modname, saveFlag) do
      swiftName = getSwiftName(name, modname)
      setEnv(name, swiftName)
      content = emitter().emit_enumeration(swiftName, cases, modname)
      save(saveFlag, modname, swiftName, content)
  end

  def integerEnum(name, cases, modname, saveFlag) do
      swiftName = getSwiftName(name, modname)
      setEnv(name, swiftName)
      content = emitter().emit_integer_enum(swiftName, cases, modname)
      save(saveFlag, modname, swiftName, content)
  end

  def inputDir(),   do: getEnv(:input, "priv/apple/")
  def outputDir(),  do: getEnv(:output, "Sources/ASN1SCG/Suite/")
  def exceptions(), do: :application.get_env(:asn1scg, "exceptions", ["Name"])

  def save(true, modname, name, res) do
      dir = outputDir()
      :filelib.ensure_dir(dir)

      # Filename is just the name (Mod_Type.swift or .rs)
      fileName = dir <> normalizeName(bin(name)) <> emitter().extension()

      verbose = getEnv(:verbose, false)
      shortName = List.last(String.split(bin(name), "_"))
      case :lists.member(shortName, exceptions()) do
           true ->  print "skipping: ~ts.swift~n", [fileName] ; setEnv(:verbose, verbose)
           false -> :ok = :file.write_file(fileName,res)      ; setEnv(:verbose, true)
                    print "compiled: ~ts~n", [fileName] ; setEnv(:verbose, verbose) end
  end

  def save(_, _, _, _), do: []

  def lookup("IssuerSerial"), do: "AuthenticationFramework_IssuerSerial"
  def lookup("GeneralNames"), do: "PKIX1Implicit_2009_GeneralNames"
  def lookup(name) do
      b = bin(name)
      if b == "AttributeDescription" do
         mod = getEnv(:current_module, "")
         :io.format("DEBUG lookup AttributeDescription: mod=~p~n", [mod])
      end
      if b == "id-at" do
         :io.format("DEBUG lookup id-at: mod=~p~n", [getEnv(:current_module, "")])
      end

      if String.starts_with?(b, "[") and String.ends_with?(b, "]") and String.length(b) > 2 do
         inner = String.slice(b, 1..-2//1)
         "[" <> lookup(inner) <> "]"
      else
        mod = getEnv(:current_module, "")
        val = if mod != "" and is_binary(b) do
           full = bin(normalizeName(mod)) <> "_" <> b
           key = try do String.to_existing_atom(full) rescue _ -> nil end
           v = if key, do: :application.get_env(:asn1scg, key, :undefined), else: :undefined
           if b == "id-at" do
              :io.format("DEBUG lookup id-at local: ~p -> ~p~n", [full, v])
           end
           v
        else :undefined end

        res = case val do
             :undefined ->
                 # Try to look up as existing atom too (for keys set by gen_x509.exs)
                 atom_key = try do String.to_existing_atom(b) rescue _ -> nil end
                 v = if atom_key do
                    case :application.get_env(:asn1scg, atom_key, :undefined) do
                        :undefined -> :application.get_env(:asn1scg, b, b)
                        found -> found
                    end
                 else
                    :application.get_env(:asn1scg, b, b)
                 end

                 if b == "id-at" do
                    :io.format("DEBUG lookup id-at global: ~p -> ~p~n", [b, v])
                 end
                 v
             v -> v
        end
        case res do
             a when a == b -> bin(a)
             x -> lookup(x)
        end
      end
  end

  def plicit([]), do: ""
  def plicit([{:tag,:CONTEXT,_,{:default,:IMPLICIT},_}]), do: "Implicit"
  def plicit([{:tag,:CONTEXT,_,{:default,:EXPLICIT},_}]), do: "Explicit"
  def plicit([{:tag,:CONTEXT,_,:IMPLICIT,_}]), do: "Implicit"
  def plicit([{:tag,:CONTEXT,_,:EXPLICIT,_}]), do: "Explicit"
  def plicit(_), do: ""

  def opt(:OPTIONAL), do: "?"
  def opt({:DEFAULT, _}), do: "?"
  def opt(_), do: ""
  def spec("sequence"), do: "SequenceOf"
  def spec("set"), do: "SetOf"
  def spec(_), do: ""
  def trace(x), do: setEnv({:trace, x}, x)
  def normalizeName(name) do
    "#{name}"
    |> String.replace("-", "_")
    |> String.replace(".", "_")
  end

  def importModuleName({:Externaltypereference, _, _, mod}), do: mod
  def importModuleName(mod), do: mod
  def setEnv(x, y) when x in [:save, :verbose, :output, :input, :language, :current_module, :current_struct], do: :application.set_env(:asn1scg, x, y)
  def setEnv(x,y) do
      mod = getEnv(:current_module, "")
      bx = bin(x)

      if is_binary(bx) and (String.contains?(bx, "subordinate_nodes") or String.contains?(bx, "subordinate-nodes")) do
          :io.format("DEBUG setEnv subordinate: key=~p val=~p~n", [bx, y])
      end

      if bx == "id-ce" or bx == "id_ce" do
          :io.format("DEBUG setEnv for id-ce: mod=~p key=~p val=~p~n", [mod, bx, y])
      end

      if mod != "" and is_binary(bx) do
         full = bin(normalizeName(mod)) <> "_" <> bx
         :application.set_env(:asn1scg, full, y)
         # Also store a normalized variant for lookups that normalize symbols (e.g. replace '-' with '_').
         nxb = normalizeName(bx)
         nfull = bin(normalizeName(mod)) <> "_" <> nxb
         if nfull != full do
            :application.set_env(:asn1scg, nfull, y)
         end
         # :io.format("setEnv: ~ts -> ~ts~n", [full, y])
      end
      :application.set_env(:asn1scg, bx, y)
      if is_binary(bx) do
         nxb = normalizeName(bx)
         if nxb != bx do
            :application.set_env(:asn1scg, nxb, y)
         end
      end
      # :io.format("setEnv: ~ts -> ~ts~n", [bx, y])
  end
  def setEnvGlobal(x, y) do
      bx = bin(x)
      :application.set_env(:asn1scg, bx, y)
      if is_binary(bx) do
         nx = normalizeName(bx)
         if nx != bx do
            :application.set_env(:asn1scg, nx, y)
         end
      end
  end
  def getEnv(x,y) when x in [:save, :verbose, :output, :input, :language, :current_module, :current_struct], do: :application.get_env(:asn1scg, x, y)
  def getEnv(x,y), do: :application.get_env(:asn1scg, bin(x), y)
  def bin(x) when is_atom(x), do: :erlang.atom_to_binary x
  def bin(x) when is_list(x), do: :erlang.list_to_binary x
  def bin(x), do: x
  def tagNo([]), do: []
  def tagNo([{:tag,_,nox,_,_}]) do nox end
  def tagClass([]), do: []
  def tagClass([{:tag,:CONTEXT,_,_,_}]),     do: ".contextSpecific" # https://github.com/erlang/otp/blob/master/lib/asn1/src/asn1ct_parser2.erl#L2011
  def tagClass([{:tag,:APPLICATION,_,_,_}]), do: ".application"
  def tagClass([{:tag,:PRIVATE,_,_,_}]),     do: ".private"
  def tagClass([{:tag,:UNIVERSAL,_,_,_}]),   do: ".universal"
  def pad(x), do: String.duplicate(" ", x)
  def partArray(bin), do: part(bin, 1, :erlang.size(bin) - 2)
  def part(a, x, y) do
      case :erlang.size(a) > y - x do
           true -> :binary.part(a, x, y)
              _ -> ""
      end
  end

end

# case System.argv() do
#   ["compile"]          -> ASN1.compile
#   ["compile","-v"]     -> ASN1.setEnv(:verbose, true) ; ASN1.compile
#   ["compile",i]        -> ASN1.setEnv(:input, i <> "/") ; ASN1.compile
#   ["compile","-v",i]   -> ASN1.setEnv(:input, i <> "/") ; ASN1.setEnv(:verbose, true) ; ASN1.compile
#   ["compile",i,o]      -> ASN1.setEnv(:input, i <> "/") ; ASN1.setEnv(:output, o <> "/") ; ASN1.compile
#   ["compile","-v",i,o] -> ASN1.setEnv(:input, i <> "/") ; ASN1.setEnv(:output, o <> "/") ; ASN1.setEnv(:verbose, true) ; ASN1.compile
#   _ -> :io.format("Copyright © 1994—2024 Namdak Tönpa.~n")
#        :io.format("ISO 8824 ITU/IETF X.680-690 ERP/1 ASN.1 DER Compiler, version 30.10.7.~n")
#        :io.format("Usage: ./asn1.ex help | compile [-v] [input [output]]~n")
# end
