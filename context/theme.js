"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

export default function Theme({children, ...props}){
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

