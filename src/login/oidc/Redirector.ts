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

import { inject, injectable } from "tsyringe";
import INeededAction from "../../solidSession/INeededAction";
import INeededInactionAction from "../../solidSession/INeededInactionAction";
import { IEnvironmentDetector } from "../../util/EnvironmentDetector";
import INeededRedirectAction from "../../solidSession/INeededRedirectAction";

export interface IRedirectorOptions {
  doNotAutoRedirect?: boolean;
  redirectByReplacingState?: boolean;
}

export interface IRedirector {
  redirect(
    redirectUrl: string,
    redirectorOptions: IRedirectorOptions
  ): INeededAction;
}

@injectable()
export default class Redirector implements IRedirector {
  constructor(
    @inject("environmentDetector")
    private environmentDetector: IEnvironmentDetector
  ) {}

  redirect(redirectUrl: string, options?: IRedirectorOptions): INeededAction {
    if (
      this.environmentDetector.detect() === "browser" &&
      !options?.doNotAutoRedirect
    ) {
      if (options && options.redirectByReplacingState) {
        window.history.replaceState({}, "", redirectUrl);
      } else {
        window.location.href = redirectUrl;
      }
      return {
        actionType: "inaction"
      } as INeededInactionAction;
    } else {
      return {
        actionType: "redirect",
        redirectUrl
      } as INeededRedirectAction;
    }
  }
}
