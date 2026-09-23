{
  description = "Declarative evironment for STANZA";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            python311
            uv
            direnv
            nix-direnv
            httpie
            sqlite
            pytest
          ];

          shellHook = ''
            echo "=================================================="
            echo "⚡ Nix-shell activated! ⚡"
            echo "Python:   $(python3 --version)"
            echo "Poetry:   $(uv --version)"
            echo "=================================================="
          '';
        };
      }
    );
}
