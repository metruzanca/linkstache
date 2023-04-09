// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import { Navigation } from "./lib/components";
import { AppContextProvider } from "./lib/appContext";

export default function Root() {

  return (
    <Html lang="en">
      <Head>
        <Title>LinkStache</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <AppContextProvider>
              <div class="h-[100dvh]">
                <Navigation />
                <div class="h-[calc(100%-4rem)]">
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </div>
              </div>
            </AppContextProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
