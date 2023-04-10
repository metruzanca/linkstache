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
import { Navigation, SplashScreen } from "./lib/components";
import { AppContextProvider } from "./lib/appContext";
import FIREBASE_CONFIG from "../firebase.json";
import { Firebase } from "./lib/firebase";
Firebase.init(FIREBASE_CONFIG);

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
              <SplashScreen>
                <div class="h-[100dvh]">
                  <Navigation />
                  <div class="h-[calc(100%-4rem)]">
                    <Routes>
                      <FileRoutes />
                    </Routes>
                  </div>
                </div>
              </SplashScreen>
            </AppContextProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
