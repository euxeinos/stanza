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
            python313
            uv
            httpie
            sqlite
            taplo
            nodejs_22
            typescript
          ];

          shellHook = ''
            echo "=================================================="
            echo "⚡ Nix-shell for STANZA activated! ⚡"
            echo "🐍 Python: $(python3 --version)"
            echo "♻️ UV:     $(uv --version)"
            echo "=================================================="
          '';
        };
      }
    );
}
