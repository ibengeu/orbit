import { OrbitMark } from "@/components/orbit/chrome";
import { writeSession } from "@/lib/orbit/session";

export function Welcome({ onEnter }: { onEnter: () => void }) {
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

      <DemoAccess />
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
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Keep your team’s work in one place.</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">
        Share updates in channels, discuss details in threads, and message teammates directly.
      </p>
      <button
        type="button"
        className="mt-5 inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        onClick={onEnter}
      >
        Continue as Alex Morgan
      </button>
    </>
  );
}

function DemoAccess() {
  return (
    <section className="flex items-center bg-plum px-4 py-8 text-paper sm:px-6 lg:px-8" aria-labelledby="demo-access-title">
      <div className="w-full rounded-xl bg-paper p-5 text-ink shadow-pop sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">Preview only</p>
        <h2 id="demo-access-title" className="mt-1 text-xl font-semibold">
          Sign-in is unavailable
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          This demo uses shared data. Do not enter private information. No account or password is required.
        </p>
      </div>
    </section>
  );
}
