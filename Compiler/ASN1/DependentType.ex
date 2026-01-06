defmodule ASN1.DependentType do
  @moduledoc """
  Handles MLTT-like dependent typing for ASN.1 Information Object Classes.
  Resolves the type of a field based on the value of another field (typically an OID).
  """

  defstruct [:parameter_field, :result_field, :mapping]
  # mapping is %{ oid_value_string => type_def }

  @doc """
  Builds a DependentType struct from an Object Set definition.

  field_name: The name of the field currently being compiled (e.g. "value")
  set_name: The name of the Object Set (e.g. "SupportedAlgorithms")
  dep_field: The name of the field that determines the type (e.g. "algorithm")
  """
  def build_from_set(set_name, dep_field) do
    # Get the object set definition from the environment
    set_def = :application.get_env(:asn1scg, {:object_set, to_string(set_name)}, [])

    mapping =
      set_def
      |> Enum.map(fn obj_ref ->
        resolve_object(obj_ref)
      end)
      |> Enum.reject(&is_nil/1)
      |> Map.new()

    %ASN1.DependentType{
      mapping: mapping
    }
  end

  defp resolve_object(obj_ref) do
    name =
      case obj_ref do
        atom when is_atom(atom) -> to_string(atom)
        str when is_binary(str) -> str
        _ -> nil
      end

    if name do
      # Try to get detailed definition first
      def_map = :application.get_env(:asn1scg, {:object_definition, name}, nil)

      case def_map do
        %{oid: oid, type: t} ->
          oid_val = extract_oid_value(oid)
          {oid_val, t}

        map when is_map(map) ->
          # Fallback keys
          oid = map[:"&id"] || map[:id]
          t = map[:"&Type"] || map[:Type]
          if oid && t do
            {extract_oid_value(oid), t}
          else
            nil
          end

        _ -> nil
      end
    else
      nil
    end
  end

  defp extract_oid_value({:value_tag, {_, _, val}}), do: to_string(val)
  defp extract_oid_value({:value_tag, {_, _, _, val}}), do: to_string(val)
  defp extract_oid_value(val), do: to_string(val)

  @doc """
  Returns a list of {oid, type} tuples for iteration.
  """
  def to_list(%ASN1.DependentType{mapping: mapping}) do
    Map.to_list(mapping)
  end
end
