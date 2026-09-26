import { useState } from "react";
import { OrbitMark } from "@/components/orbit/chrome";
import { writeSession } from "@/lib/orbit/session";

export function Welcome({ onEnter }: { onEnter: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const enter = () => {
    writeSession();
    onEnter();
  };
  return (
    <main className="min-h-dvh bg-paper text-ink lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(27.4rem,32.6rem)]">
      <a
        href="#signin"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-20 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2 focus:shadow-pop"
      >
        Skip to sign in
      </a>

      <img
        src="/orbit-desk.jpg"
        alt="A cream desk with a hand-drawn orbit, a red pencil, a cup of tea, and three blank notes."
        className="h-44 w-full object-cover object-center sm:h-56 lg:hidden"
      />
      <div className="px-4 py-6 sm:px-8 lg:hidden">
        <WelcomeCopy onEnter={enter} />
      </div>

      <section className="relative hidden min-h-dvh lg:block">
        <img
          src="/orbit-desk.jpg"
          alt="A cream desk with a hand-drawn orbit, a red pencil, a cup of tea, and three blank notes."
          className="absolute inset-0 h-full w-full object-cover object-left"
        />
        <div className="relative flex h-full min-h-dvh flex-col justify-end p-10">
          <div className="max-w-lg rounded-xl bg-paper/95 p-6 shadow-pop">
            <WelcomeCopy onEnter={enter} />
          </div>
        </div>
      </section>

      <SignIn showPassword={showPassword} onToggle={() => setShowPassword((value) => !value)} />
    </main>
  );
}

function WelcomeCopy({ onEnter }: { onEnter: () => void }) {
  return (
    <>
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-plum text-paper">
          <OrbitMark className="size-5" />
        </span>
        Orbit
        <span className="font-medium text-ink-soft">Launch desk</span>
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">The notes are already out.</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">
        Channels for the plan, a thread for the crop, and a DM for the thing that doesn’t belong in #general. This demo stays on your computer.
      </p>
      <button
        type="button"
        className="mt-5 inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        onClick={onEnter}
      >
        Continue to demo
      </button>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        You’ll come in as Alex Morgan. Sign out later and the desk stays as you left it.
      </p>
    </>
  );
}

function SignIn({ showPassword, onToggle }: { showPassword: boolean; onToggle: () => void }) {
  return (
    <section className="flex items-center bg-plum px-4 py-8 text-paper sm:px-6 lg:px-8" aria-labelledby="signin-title">
      <div id="signin" className="w-full rounded-xl bg-paper p-5 text-ink shadow-pop sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">Preview only</p>
        <h2 id="signin-title" className="mt-1 text-xl font-semibold">
          Sign in
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Preview only — account sign-in is unavailable. The form has a shape. It will not take a password, and it will not pretend you got in.
        </p>
        <form className="mt-5 grid gap-3" onSubmit={(event) => event.preventDefault()}>
          <label className="grid gap-1 text-sm font-medium" htmlFor="orbit-email">
            Email
            <input
              id="orbit-email"
              name="email"
              type="email"
              autoComplete="username"
              disabled
              placeholder="alex@orbit.invalid"
              className="h-11 rounded-md border border-line bg-paper-raised px-3 text-sm text-ink-soft"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium" htmlFor="orbit-password">
            Password
            <input
              id="orbit-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled
              placeholder="Not collected"
              className="h-11 rounded-md border border-line bg-paper-raised px-3 text-sm text-ink-soft"
            />
          </label>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-self-start rounded-md px-1 text-sm font-medium text-ink underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={onToggle}
          >
            {showPassword ? "Hide password" : "Show password"}
          </button>
          <label className="flex h-11 items-center gap-2 text-sm text-ink">
            <input type="checkbox" disabled name="remember" />
            Remember me
          </label>
          <button type="submit" disabled className="h-11 rounded-md bg-line text-sm font-semibold text-ink-soft">
            Submit
          </button>
          <p className="text-sm leading-relaxed text-ink-soft">
            Forgot password isn’t available in this demo. If you lost one, good news: there isn’t one.
          </p>
        </form>
      </div>
    </section>
  );
}
