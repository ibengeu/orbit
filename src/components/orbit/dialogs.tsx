import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useOrbit } from "@/lib/orbit/store";

export function OrbitDialogs() {
  return (
    <>
      <ChannelDialog />
      <WorkspaceDialog />
      <StatusDialog />
      <PrefsDialog />
    </>
  );
}

function ChannelDialog() {
  const open = useOrbit((state) => state.channelDialog);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <Shell
      open={open}
      onOpenChange={(next) => {
        useOrbit.getState().setChannelDialog(next);
        if (!next) {
          setName("");
          setDescription("");
          setError(null);
        }
      }}
      title="Create a channel"
      description="Channels are visible to everyone in this workspace."
    >
      <form
        className="mt-4 flex flex-col gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await useOrbit.getState().createChannel(name, description);
          setError(result);
          if (!result) {
            setName("");
            setDescription("");
          }
        }}
      >
        <Field id="channel-name" label="Channel name" value={name} onChange={setName} />
        <Field id="channel-description" label="Description" value={description} onChange={setDescription} />
        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
        <Submit label="Create channel" />
      </form>
    </Shell>
  );
}

function WorkspaceDialog() {
  const open = useOrbit((state) => state.workspaceDialog);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <Shell
      open={open}
      onOpenChange={(next) => {
        useOrbit.getState().setWorkspaceDialog(next);
        if (!next) {
          setName("");
          setError(null);
        }
      }}
      title="Create a workspace"
      description="It starts with a #general channel and is saved with your workspace."
    >
      <form
        className="mt-4 flex flex-col gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await useOrbit.getState().createWorkspace(name);
          setError(result);
          if (!result) setName("");
        }}
      >
        <Field id="workspace-name" label="Workspace name" value={name} onChange={setName} />
        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
        <Submit label="Create workspace" />
      </form>
    </Shell>
  );
}

function StatusDialog() {
  const open = useOrbit((state) => state.statusDialog);
  const status = useOrbit((state) => state.status);
  const [value, setValue] = useState(status);
  return (
    <Shell
      open={open}
      onOpenChange={(next) => {
        if (next) setValue(useOrbit.getState().status);
        useOrbit.getState().setStatusDialog(next);
      }}
      title="Set a status"
      description="Teammates on this device will see it under your name."
    >
      <form
        className="mt-4 flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          useOrbit.getState().setStatus(value);
          useOrbit.getState().setStatusDialog(false);
        }}
      >
        <Field id="status-text" label="Status" value={value} onChange={setValue} />
        <Submit label="Save status" />
      </form>
    </Shell>
  );
}

function PrefsDialog() {
  const open = useOrbit((state) => state.prefsDialog);
  const always = useOrbit((state) => state.alwaysShowTime);
  return (
    <Shell
      open={open}
      onOpenChange={useOrbit.getState().setPrefsDialog}
      title="Preferences"
      description="Choose how message times appear."
    >
      <label className="mt-4 flex items-center justify-between gap-4 text-sm">
        <span>Always show message times</span>
        <input
          type="checkbox"
          checked={always}
          onChange={(event) => useOrbit.getState().setAlwaysShowTime(event.target.checked)}
          className="size-4 accent-accent"
        />
      </label>
    </Shell>
  );
}

function Shell({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="orbit-pop fixed inset-x-4 top-24 z-50 mx-auto w-auto max-w-md rounded-xl border border-line bg-paper-raised p-5 text-ink shadow-pop outline-none">
          <Dialog.Title className="text-lg font-semibold text-balance">{title}</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-ink-soft">{description}</Dialog.Description>
          {children}
          <Dialog.Close className="mt-4 text-sm font-medium text-ink-soft underline">Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label htmlFor={id} className="text-sm font-medium">
      {label}
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 font-normal outline-none focus-visible:border-accent"
      />
    </label>
  );
}

function Submit({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label}
    </button>
  );
}
