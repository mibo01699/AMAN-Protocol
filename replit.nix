{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.python310
    pkgs.python310Packages.pip
  ];
}
