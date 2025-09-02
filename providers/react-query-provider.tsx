"use client"

import { ReactNode, useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
    const [client] = useState(() => new QueryClient());

    return <QueryClientProvider client={client}>
        {children}
    </QueryClientProvider>
}