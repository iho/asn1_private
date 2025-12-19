swift:
	 elixir gen_x509.exs --language Swift --output Sources/Suite/XSeries/ && swift build && swift run -Xswiftc -suppress-warnings

basic:
	mix run -e 'Application.put_env(:asn1scg, :input, "priv/basic/"); Application.put_env(:asn1scg, :output, "Sources/Suite/Basic/"); ASN1.compile()'