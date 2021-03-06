/**
 * This project is a continuation of Inrupt's awesome solid-auth-fetcher project,
 * see https://www.npmjs.com/package/@inrupt/solid-auth-fetcher.
 * Copyright 2020 The Solid Project.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Test for LegacyImplicitFlowOidcHandler
 */
import "reflect-metadata";
import LegacyImplicitFlowOidcHandler from "../../../../src/login/oidc/oidcHandlers/LegacyImplicitFlowOidcHandler";
import { DpopHeaderCreatorMock } from "../../../../src/dpop/__mocks__/DpopHeaderCreator";
import { FetcherMock } from "../../../../src/util/__mocks__/Fetcher";
import canHandleTests from "./OidcHandlerCanHandleTests";
import { SessionCreatorMock } from "../../../../src/solidSession/__mocks__/SessionCreator";
import ISolidSession from "../../../../src/solidSession/ISolidSession";
import IOidcOptions from "../../../../src/login/oidc/IOidcOptions";
import { standardOidcOptions } from "../../../../src/login/oidc/__mocks__/IOidcOptions";

describe("LegacyImplicitFlowOidcHandler", () => {
  const defaultMocks = {
    fetcher: FetcherMock,
    dpopHeaderCreator: DpopHeaderCreatorMock,
    sessionCreator: SessionCreatorMock
  };
  function getLegacyImplicitFlowOidcHandler(
    mocks: Partial<typeof defaultMocks> = defaultMocks
  ): LegacyImplicitFlowOidcHandler {
    return new LegacyImplicitFlowOidcHandler(
      mocks.fetcher ?? defaultMocks.fetcher,
      mocks.dpopHeaderCreator ?? defaultMocks.dpopHeaderCreator,
      mocks.sessionCreator ?? defaultMocks.sessionCreator
    );
  }

  describe("canHandle", () => {
    const legacyImplicitFlowOidcHandler = getLegacyImplicitFlowOidcHandler();
    canHandleTests["legacyImplicitFlowOidcHandler"].forEach(testConfig => {
      it(testConfig.message, async () => {
        const value = await legacyImplicitFlowOidcHandler.canHandle(
          testConfig.oidcOptions
        );
        expect(value).toBe(testConfig.shouldPass);
      });
    });
  });

  describe("handle", () => {
    it("Creates the right session with dpop ", async () => {
      const legacyImplicitFlowOidcHandler = getLegacyImplicitFlowOidcHandler();
      const oidcOptions: IOidcOptions = {
        ...standardOidcOptions
      };
      const session: ISolidSession = await legacyImplicitFlowOidcHandler.handle(
        oidcOptions
      );
      expect(defaultMocks.sessionCreator.create).toHaveBeenCalledWith({
        loggedIn: false,
        neededAction: {
          actionType: "redirect",
          redirectUrl:
            "https://example.com/auth?response_type=id_token%20token&redirect_url=https%3A%2F%2Fapp.example.com&scope=openid%20id_vc&dpop=someToken"
        }
      });
    });

    it("Creates the right session without dpop", async () => {
      const legacyImplicitFlowOidcHandler = getLegacyImplicitFlowOidcHandler();
      const oidcOptions: IOidcOptions = {
        ...standardOidcOptions,
        dpop: false
      };
      const session: ISolidSession = await legacyImplicitFlowOidcHandler.handle(
        oidcOptions
      );
      expect(defaultMocks.sessionCreator.create).toHaveBeenCalledWith({
        loggedIn: false,
        neededAction: {
          actionType: "redirect",
          redirectUrl:
            "https://example.com/auth?response_type=id_token%20token&redirect_url=https%3A%2F%2Fapp.example.com&scope=openid%20id_vc"
        }
      });
    });
  });
});
