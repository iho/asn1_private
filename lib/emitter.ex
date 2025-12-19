defmodule ASN1.Emitter do
  @callback language() :: String.t()
  @callback extension() :: String.t()
  @callback escape_kw(String.t()) :: String.t()
  @callback substitute_type(type :: String.t()) :: String.t()
  @callback emit_imprint() :: String.t()

  # Type Definitions
  @callback emit_sequence(name :: String.t(), fields :: list(), mod :: String.t()) :: String.t()
  @callback emit_set(name :: String.t(), fields :: list(), mod :: String.t()) :: String.t()
  @callback emit_choice(name :: String.t(), cases :: list(), mod :: String.t()) :: String.t()
  @callback emit_enumeration(name :: String.t(), cases :: list(), mod :: String.t()) :: String.t()
  @callback emit_integer_enum(name :: String.t(), cases :: list(), mod :: String.t()) :: String.t()
  @callback emit_array(name :: String.t(), type :: String.t(), tag :: atom(), mod :: String.t()) :: String.t()


  # Simple Types / Aliases
  @callback emit_typealias(name :: String.t(), target :: String.t(), mod :: String.t()) :: String.t()
  @callback emit_oid_value(name :: String.t(), definition :: String.t(), mod :: String.t()) :: String.t()

  # Lifecycle
  @callback finalize(output_dir :: String.t()) :: :ok
end
