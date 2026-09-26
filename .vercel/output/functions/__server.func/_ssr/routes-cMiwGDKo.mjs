import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as Bold, C as House, D as Code, E as Copy, O as ChevronDown, S as Italic, T as Ellipsis, _ as Mic, a as UserRound, b as Menu, c as Smile, d as Plus, f as Pin, g as Paperclip, h as Pencil, i as Users, j as Bell, k as Bookmark, l as Send, m as PhoneOff, n as Video, p as Phone, r as VideoOff, s as Trash2, t as X, u as Search, v as MicOff, w as Hash, x as Link2, y as MessageSquare } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as isToday, r as format, t as isYesterday } from "../_libs/date-fns.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as RadioGroup2, c as Separator2, i as Portal2, l as Trigger, n as Item2, o as RadioItem2, r as ItemIndicator2, s as Root2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-cMiwGDKo.js
var routes_cMiwGDKo_exports = /* @__PURE__ */ __exportAll({
	a: () => localTracks,
	c: () => stopCallTracks,
	component: () => SplitComponent,
	i: () => forgetFile,
	n: () => explainMediaError,
	o: () => rememberFile,
	r: () => fileUrl,
	s: () => setTrackEnabled,
	t: () => captureMedia
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tracks = {
	audio: null,
	video: null
};
var urls = /* @__PURE__ */ new Map();
function rememberFile(id, file) {
	const previous = urls.get(id);
	if (previous) URL.revokeObjectURL(previous);
	const url = URL.createObjectURL(file);
	urls.set(id, url);
	return url;
}
function fileUrl(id) {
	return urls.get(id) ?? null;
}
function forgetFile(id) {
	const url = urls.get(id);
	if (url) URL.revokeObjectURL(url);
	urls.delete(id);
}
function localTracks() {
	return tracks;
}
function stopCallTracks() {
	tracks.audio?.stop();
	tracks.video?.stop();
	tracks.audio = null;
	tracks.video = null;
}
function setTrackEnabled(kind, enabled) {
	const track = tracks[kind];
	if (track) track.enabled = enabled;
}
function explainMediaError(error, device) {
	if (error instanceof DOMException) {
		if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") return `${device[0]?.toUpperCase() ?? ""}${device.slice(1)} permission was denied.`;
		if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") return `No ${device} was found.`;
		if (error.name === "NotReadableError") return `The ${device} is unavailable.`;
	}
	return `Couldn’t use the ${device}.`;
}
async function captureMedia(audio, video) {
	const stream = await navigator.mediaDevices.getUserMedia({
		audio: audio ? { echoCancellation: true } : false,
		video: video ? { facingMode: "user" } : false
	});
	if (audio) {
		tracks.audio?.stop();
		tracks.audio = stream.getAudioTracks()[0] ?? null;
	} else stream.getAudioTracks().forEach((track) => track.stop());
	if (video) {
		tracks.video?.stop();
		tracks.video = stream.getVideoTracks()[0] ?? null;
	} else stream.getVideoTracks().forEach((track) => track.stop());
	return tracks;
}
var YOU = "u_me";
var STORAGE_KEY = "orbit:v1";
var REACTIONS = [
	"👍",
	"❤️",
	"😂",
	"🎉",
	"👀",
	"🙌"
];
var EMOJIS = [
	"👍",
	"🎉",
	"✅",
	"👀",
	"🔥",
	"🙏",
	"😮",
	"👏",
	"💯",
	"🐛",
	"📌",
	"⏳",
	"😅",
	"🤝",
	"💡",
	"🚀"
];
var USERS = [
	{
		id: "u_me",
		name: "Alex Morgan",
		handle: "alex",
		initials: "AM",
		title: "Product",
		presence: "online",
		status: "Launch desk"
	},
	{
		id: "priya",
		name: "Priya Shah",
		handle: "priya",
		initials: "PS",
		title: "Engineering",
		presence: "online"
	},
	{
		id: "noah",
		name: "Noah Adeyemi",
		handle: "noah",
		initials: "NA",
		title: "Design",
		presence: "away",
		status: "Reviewing crops"
	},
	{
		id: "jules",
		name: "Jules Ortega",
		handle: "jules",
		initials: "JO",
		title: "Program",
		presence: "online"
	},
	{
		id: "lena",
		name: "Lena Park",
		handle: "lena",
		initials: "LP",
		title: "Design",
		presence: "online"
	},
	{
		id: "samir",
		name: "Samir Okonkwo",
		handle: "samir",
		initials: "SO",
		title: "Engineering",
		presence: "offline"
	},
	{
		id: "avery",
		name: "Avery Quinn",
		handle: "avery",
		initials: "AQ",
		title: "Launch",
		presence: "online"
	},
	{
		id: "kai",
		name: "Kai Nakamura",
		handle: "kai",
		initials: "KN",
		title: "Support",
		presence: "away",
		status: "On tickets"
	},
	{
		id: "mina",
		name: "Mina Brooks",
		handle: "mina",
		initials: "MB",
		title: "Operations",
		presence: "online"
	},
	{
		id: "theo",
		name: "Theo Marlow",
		handle: "theo",
		initials: "TM",
		title: "Research",
		presence: "offline"
	}
];
var ORBIT_MEMBERS = [
	"u_me",
	"priya",
	"noah",
	"jules",
	"lena",
	"samir",
	"avery",
	"kai"
];
var SEED_CONVERSATIONS = [
	{
		kind: "channel",
		id: "general",
		workspaceId: "orbit",
		name: "general",
		description: "Company-wide notes and launch timing.",
		memberIds: ORBIT_MEMBERS
	},
	{
		kind: "channel",
		id: "product",
		workspaceId: "orbit",
		name: "product",
		description: "Scope, checklist, and what actually ships.",
		memberIds: ORBIT_MEMBERS
	},
	{
		kind: "channel",
		id: "design",
		workspaceId: "orbit",
		name: "design",
		description: "Reviews, crops, and type.",
		memberIds: ORBIT_MEMBERS
	},
	{
		kind: "channel",
		id: "engineering",
		workspaceId: "orbit",
		name: "engineering",
		description: "Bugs, fixes, and the deploy window.",
		memberIds: ORBIT_MEMBERS
	},
	{
		kind: "channel",
		id: "announcements",
		workspaceId: "orbit",
		name: "announcements",
		description: "Decisions worth pinning.",
		memberIds: ORBIT_MEMBERS
	},
	{
		kind: "channel",
		id: "random",
		workspaceId: "orbit",
		name: "random",
		description: "Not work. Mostly.",
		memberIds: ORBIT_MEMBERS
	},
	{
		kind: "dm",
		id: "dm-priya",
		workspaceId: "orbit",
		participantIds: ["u_me", "priya"]
	},
	{
		kind: "dm",
		id: "dm-noah",
		workspaceId: "orbit",
		participantIds: ["u_me", "noah"]
	},
	{
		kind: "dm",
		id: "dm-kai",
		workspaceId: "orbit",
		participantIds: ["u_me", "kai"]
	},
	{
		kind: "dm",
		id: "dm-avery",
		workspaceId: "orbit",
		participantIds: ["u_me", "avery"]
	},
	{
		kind: "dm",
		id: "dm-launch",
		workspaceId: "orbit",
		participantIds: [
			"u_me",
			"jules",
			"lena",
			"avery"
		],
		title: "Launch crew"
	},
	{
		kind: "channel",
		id: "lumen-general",
		workspaceId: "lumen",
		name: "general",
		description: "A quiet second workspace, so switching is real.",
		memberIds: [
			"u_me",
			"mina",
			"theo"
		]
	}
];
function stamp(daysAgo, hour, minute) {
	const d = /* @__PURE__ */ new Date("2026-09-26T12:00:00Z");
	d.setUTCDate(d.getUTCDate() - daysAgo);
	d.setUTCHours(hour, minute, 0, 0);
	return d.toISOString();
}
function msg(input) {
	return {
		reactions: [],
		...input
	};
}
var SEED_MESSAGES = [
	msg({
		id: "gen-kickoff",
		conversationId: "general",
		authorId: "jules",
		createdAt: stamp(2, 9, 12),
		body: "Kicking off launch week. The public post goes Thursday at 10:00 ET if design signs the hero. Drop blockers here instead of side threads."
	}),
	msg({
		id: "gen-press",
		conversationId: "general",
		authorId: "avery",
		createdAt: stamp(2, 9, 40),
		body: "Press note is with legal. I’ll have a redline back before standup, and I won’t schedule the post until Jules says the hero is locked."
	}),
	msg({
		id: "gen-checklist",
		conversationId: "general",
		authorId: "u_me",
		createdAt: stamp(2, 11, 5),
		body: "Thanks. I’ll keep the checklist in #product so we aren’t hunting across channels the morning of."
	}),
	msg({
		id: "gen-hero",
		conversationId: "general",
		authorId: "lena",
		createdAt: stamp(1, 10, 2),
		body: "Hero is approved with the crop Noah posted. Announcement copy can lock.",
		reactions: [{
			emoji: "🎉",
			userIds: ["avery", "jules"]
		}]
	}),
	msg({
		id: "gen-deploy",
		conversationId: "general",
		authorId: "samir",
		createdAt: stamp(1, 10, 18),
		body: "Deploy window is 9:30–11:00 ET. I’ll be on the rollback. If billing snapshots flake again, we ship anyway and watch the worker."
	}),
	msg({
		id: "gen-staging",
		conversationId: "general",
		authorId: "priya",
		createdAt: stamp(0, 9, 5),
		body: "Staging looks clean. One flaky snapshot in billing tests, not a launch blocker. Tracking it in #engineering."
	}),
	msg({
		id: "gen-staging-2",
		conversationId: "general",
		authorId: "priya",
		createdAt: stamp(0, 9, 6),
		body: "Same run, second look: the flake is the billing snapshot only. App boot stayed green."
	}),
	msg({
		id: "gen-staging-3",
		conversationId: "general",
		authorId: "priya",
		createdAt: stamp(0, 9, 7),
		body: "I’ll leave the test quarantined until after Thursday. Not worth a revert today."
	}),
	msg({
		id: "gen-shots",
		conversationId: "general",
		authorId: "noah",
		createdAt: stamp(0, 9, 22),
		body: "Marketing screenshots are in the shared folder, named by frame: https://files.example.com/orbit/marketing/launch-week/frames/hero-b-hand-kerned-export-do-not-reexport.png — please don’t re-export them. A single * is not emphasis."
	}),
	msg({
		id: "gen-social",
		conversationId: "general",
		authorId: "avery",
		createdAt: stamp(0, 9, 40),
		body: "Social is drafted, not scheduled. If we slip past noon I’ll pull the thread rather than let it go out half-true.",
		reactions: [{
			emoji: "👍",
			userIds: ["u_me", "jules"]
		}]
	}),
	msg({
		id: "prod-scope",
		conversationId: "product",
		authorId: "jules",
		createdAt: stamp(1, 11, 30),
		body: "Scope for this launch is the workspace switcher, message search, and thread replies. Guest accounts are a fast-follow, and I don’t want them in the post."
	}),
	msg({
		id: "prod-notes",
		conversationId: "product",
		authorId: "u_me",
		createdAt: stamp(1, 16, 5),
		body: "Agreed. Customer-facing notes are in the [launch checklist](https://example.com/orbit-checklist). I’ll trim anything that sounds like a *roadmap*, keep **the *launch* scope** tight, and leave the status line as `final`."
	}),
	msg({
		id: "prod-draft",
		conversationId: "product",
		authorId: "u_me",
		createdAt: stamp(1, 16, 42),
		body: "Wrote the what’s-new draft so we can stop passing the doc around.\n\nSearch finds messages and the replies inside a thread. Switching conversations keeps an unsent draft. Guest accounts are not in this post.\n\nIf a line sounds like a promise we can’t keep on Thursday, cut it. I’d rather ship a short note than a careful one that overreaches."
	}),
	msg({
		id: "prod-mention",
		conversationId: "product",
		authorId: "jules",
		createdAt: stamp(0, 10, 14),
		body: "@alex can you confirm the checklist before 4? Legal wants the “what’s new” bullets, and Avery is holding the post until those are final.",
		reactions: [{
			emoji: "👀",
			userIds: ["avery"]
		}]
	}),
	msg({
		id: "prod-pair",
		conversationId: "product",
		authorId: "lena",
		createdAt: stamp(0, 10, 26),
		body: "I can pair on the bullets if the design section is still loose. The hero sentence should stay one line."
	}),
	msg({
		id: "design-hero",
		conversationId: "design",
		authorId: "noah",
		createdAt: stamp(1, 13, 10),
		body: "Reviewing the marketing hero. I tried a tighter crop so the product frame isn’t floating in paper. Look at frame “Launch / Hero B” before you comment on type.",
		reactions: [{
			emoji: "👀",
			userIds: ["lena", "u_me"]
		}]
	}),
	msg({
		id: "design-r1",
		conversationId: "design",
		authorId: "lena",
		parentId: "design-hero",
		createdAt: stamp(1, 13, 22),
		body: "The crop is better. The caption under the frame is competing with the headline. Can we drop it on desktop?"
	}),
	msg({
		id: "design-r2",
		conversationId: "design",
		authorId: "noah",
		parentId: "design-hero",
		createdAt: stamp(1, 13, 28),
		body: "Yes. I’ll keep the caption on mobile, where the frame is smaller and the headline wraps."
	}),
	msg({
		id: "design-r3",
		conversationId: "design",
		authorId: "u_me",
		parentId: "design-hero",
		createdAt: stamp(1, 13, 41),
		body: "Drop it on desktop. The headline already says what the screen is. Don’t add a second line to explain the picture."
	}),
	msg({
		id: "design-r4",
		conversationId: "design",
		authorId: "lena",
		parentId: "design-hero",
		createdAt: stamp(1, 14, 5),
		body: "Updated. Also nudged the plum rail so it doesn’t clip at 1440. The send button and the mention badge were shouting at each other — badge stays small."
	}),
	msg({
		id: "design-r5",
		conversationId: "design",
		authorId: "noah",
		parentId: "design-hero",
		createdAt: stamp(1, 14, 16),
		body: "Shipping Hero B. I’ll stop moving the frame.",
		reactions: [{
			emoji: "✅",
			userIds: ["u_me", "lena"]
		}]
	}),
	msg({
		id: "design-type",
		conversationId: "design",
		authorId: "lena",
		createdAt: stamp(1, 15, 2),
		body: "Sidebar type ramp looks right. I’m still unsure the accent should be the only solid fill in the composer. It is, and I think that’s the point."
	}),
	msg({
		id: "design-accent",
		conversationId: "design",
		authorId: "u_me",
		createdAt: stamp(1, 15, 20),
		body: "They can share one accent. The badge is a few characters. The button is the only solid control. If both yell, we shrink the badge, not the button."
	}),
	msg({
		id: "design-final",
		conversationId: "design",
		authorId: "noah",
		createdAt: stamp(0, 11, 5),
		body: "Final hero is in the folder. I’ll post the announcement crop once Avery locks the headline — not before.",
		attachments: [{
			id: "hero-b",
			name: "launch-hero-b.png",
			size: 1843200
		}]
	}),
	msg({
		id: "eng-bug",
		conversationId: "engineering",
		authorId: "samir",
		createdAt: stamp(2, 14, 10),
		body: "Checkout retry is firing twice when the card network times out. I think the client and the worker both schedule a retry."
	}),
	msg({
		id: "eng-repro",
		conversationId: "engineering",
		authorId: "priya",
		createdAt: stamp(2, 15, 22),
		body: "I can reproduce on staging with a forced 504. Looking at `retryBudget` now.",
		reactions: [{
			emoji: "🐛",
			userIds: ["samir"]
		}]
	}),
	msg({
		id: "eng-budget",
		conversationId: "engineering",
		authorId: "samir",
		createdAt: stamp(1, 11, 48),
		editedAt: stamp(1, 12, 5),
		body: "Retry budget is 3, not 5. The extra attempts were stacking on the worker and that’s what double-charged the test card."
	}),
	msg({
		id: "eng-fix",
		conversationId: "engineering",
		authorId: "priya",
		createdAt: stamp(1, 12, 30),
		body: "Fixed in the worker. The guard is `if (attempt >= budget) return`. The client still retries once so a dead tab doesn’t lose the payment. Test is in the PR.",
		reactions: [{
			emoji: "✅",
			userIds: ["u_me", "jules"]
		}]
	}),
	msg({
		id: "eng-notes",
		conversationId: "engineering",
		authorId: "u_me",
		createdAt: stamp(1, 12, 44),
		body: "If that stays green, we don’t mention it in the launch notes. Quiet fixes can stay quiet."
	}),
	msg({
		id: "eng-mention",
		conversationId: "engineering",
		authorId: "priya",
		createdAt: stamp(0, 11, 20),
		body: "@alex the retry patch is in. Can you glance at the assertion before we call the bug done?"
	}),
	msg({
		id: "ann-date",
		conversationId: "announcements",
		authorId: "jules",
		createdAt: stamp(2, 16, 20),
		body: "Thursday is the date. I’ll put the real sentence in the pin once Avery and legal agree on the wording."
	}),
	msg({
		id: "ann-pin",
		conversationId: "announcements",
		authorId: "avery",
		createdAt: stamp(1, 9, 5),
		pinned: true,
		body: "Orbit opens to new teams Thursday, 10:00 ET. Shipping: channels, threads, and search. Not shipping: guest accounts. This pin stays through Friday.",
		reactions: [{
			emoji: "📌",
			userIds: ["jules", "u_me"]
		}]
	}),
	msg({
		id: "ann-hours",
		conversationId: "announcements",
		authorId: "jules",
		createdAt: stamp(1, 17, 10),
		body: "Office hours Friday 4:30 ET if a new team hits a rough edge. I’ll staff it with Priya. Bring the real error, not a paraphrase."
	}),
	msg({
		id: "ann-headline",
		conversationId: "announcements",
		authorId: "avery",
		createdAt: stamp(0, 8, 50),
		body: "Headline is locked: “Orbit is open.” No exclamation point. If this and the pin ever disagree, the pin wins."
	}),
	msg({
		id: "ann-support",
		conversationId: "announcements",
		authorId: "kai",
		createdAt: stamp(0, 9, 12),
		body: "Support will copy the pin into the help center after 10:00 ET, not before. I don’t want two versions live at once."
	}),
	msg({
		id: "rand-puzzle",
		conversationId: "random",
		authorId: "samir",
		createdAt: stamp(1, 17, 40),
		body: "Someone left a puzzle half-done on the table by the window. I will not be the person who finishes it."
	}),
	msg({
		id: "rand-art",
		conversationId: "random",
		authorId: "avery",
		createdAt: stamp(1, 17, 55),
		body: "Leave it. An unfinished puzzle is the only honest art in this office."
	}),
	msg({
		id: "rand-coffee",
		conversationId: "random",
		authorId: "kai",
		createdAt: stamp(0, 15, 40),
		body: "The urn on 4 is empty and I am choosing not to be brave about it."
	}),
	msg({
		id: "rand-pot",
		conversationId: "random",
		authorId: "lena",
		createdAt: stamp(0, 15, 48),
		body: "I’ll bring a pot down. This is my one launch-week contribution to morale.",
		reactions: [{
			emoji: "🙏",
			userIds: ["kai", "noah"]
		}]
	}),
	msg({
		id: "rand-snacks",
		conversationId: "random",
		authorId: "noah",
		createdAt: stamp(0, 16, 2),
		body: "Hero B is done, so I am officially available for snacks and bad opinions."
	}),
	msg({
		id: "dm-p1",
		conversationId: "dm-priya",
		authorId: "priya",
		createdAt: stamp(1, 16, 40),
		body: "You around to look at the retry patch before I open it? I care about the double-charge case more than the naming."
	}),
	msg({
		id: "dm-p2",
		conversationId: "dm-priya",
		authorId: "u_me",
		createdAt: stamp(1, 16, 44),
		body: "Yes. Send the diff. If the test forces a 504 and asserts a single capture, I’m good."
	}),
	msg({
		id: "dm-p3",
		conversationId: "dm-priya",
		authorId: "priya",
		createdAt: stamp(1, 16, 51),
		body: "Pushed. That’s the assertion. I’ll merge after you glance — no rush past tonight."
	}),
	msg({
		id: "dm-n1",
		conversationId: "dm-noah",
		authorId: "noah",
		createdAt: stamp(0, 9, 30),
		body: "Hero B is the one. I killed the desktop caption, like we said in the thread."
	}),
	msg({
		id: "dm-n2",
		conversationId: "dm-noah",
		authorId: "u_me",
		createdAt: stamp(0, 9, 36),
		body: "Looks right. Don’t let the rail clip at 1440 — Lena already caught it once."
	}),
	msg({
		id: "dm-n3",
		conversationId: "dm-noah",
		authorId: "noah",
		createdAt: stamp(0, 9, 41),
		body: "Already nudged. I’ll stop tinkering."
	}),
	msg({
		id: "dm-k1",
		conversationId: "dm-kai",
		authorId: "kai",
		createdAt: stamp(0, 14, 12),
		body: "Two teams wrote in asking whether search includes thread replies. I told them I’d confirm before I answer in the help note."
	}),
	msg({
		id: "dm-k2",
		conversationId: "dm-kai",
		authorId: "kai",
		createdAt: stamp(0, 14, 18),
		body: "Also, one of them thought Later was a snooze. Worth a line so we don’t get tickets about “missing reminders”."
	}),
	msg({
		id: "dm-k3",
		conversationId: "dm-kai",
		authorId: "u_me",
		createdAt: stamp(0, 14, 26),
		body: "Search includes thread replies. Later is a saved list, not a reminder. You can say both in one sentence."
	}),
	msg({
		id: "dm-a1",
		conversationId: "dm-avery",
		authorId: "avery",
		createdAt: stamp(1, 15, 10),
		body: "I’m holding the launch post until you say the what’s-new lines are final. No surprises in the headline."
	}),
	msg({
		id: "dm-a2",
		conversationId: "dm-avery",
		authorId: "u_me",
		createdAt: stamp(1, 15, 18),
		body: "Leave it in draft. I’ll send the last line once legal is done, not before."
	}),
	msg({
		id: "dm-a3",
		conversationId: "dm-avery",
		authorId: "avery",
		createdAt: stamp(0, 8, 40),
		body: "Understood. I won’t schedule anything while the pin and the post can still disagree."
	}),
	msg({
		id: "crew-1",
		conversationId: "dm-launch",
		authorId: "jules",
		createdAt: stamp(1, 18, 2),
		body: "Can we do a 15-minute launch desk at 9:40 ET tomorrow? Avery, Lena, Rowan. No slides."
	}),
	msg({
		id: "crew-2",
		conversationId: "dm-launch",
		authorId: "avery",
		createdAt: stamp(1, 18, 6),
		body: "9:40 works. I’ll have the post in draft mode, not scheduled, until we say go."
	}),
	msg({
		id: "crew-3",
		conversationId: "dm-launch",
		authorId: "lena",
		createdAt: stamp(1, 18, 11),
		body: "I’ll be there. If Hero B slips I’ll say so at the start, not halfway through."
	}),
	msg({
		id: "crew-4",
		conversationId: "dm-launch",
		authorId: "u_me",
		createdAt: stamp(1, 18, 20),
		body: "9:40 works. I’ll bring the checklist and nothing else."
	}),
	msg({
		id: "crew-5",
		conversationId: "dm-launch",
		authorId: "jules",
		createdAt: stamp(0, 9, 2),
		body: "Desk is on. Same link as standup. If you’re late, read the pin in #announcements first."
	}),
	msg({
		id: "lumen-1",
		conversationId: "lumen-general",
		authorId: "mina",
		createdAt: stamp(3, 11, 0),
		body: "Welcome to Lumen. This workspace is only here so you can leave Orbit and come back. The launch work stays next door."
	}),
	msg({
		id: "lumen-2",
		conversationId: "lumen-general",
		authorId: "theo",
		createdAt: stamp(3, 11, 20),
		body: "I’ll keep research notes out of Orbit’s #product. If something needs a decision, I’ll write it in a sentence, not a memo."
	})
];
function justBefore(messageId) {
	const message = SEED_MESSAGES.find((item) => item.id === messageId);
	if (!message) return (/* @__PURE__ */ new Date()).toISOString();
	return (/* @__PURE__ */ new Date(new Date(message.createdAt).getTime() - 1e3)).toISOString();
}
function latestIn(conversationId) {
	const items = SEED_MESSAGES.filter((item) => item.conversationId === conversationId);
	return items.reduce((latest, item) => item.createdAt > latest ? item.createdAt : latest, items[0]?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString());
}
var INITIAL_LAST_READ = {
	general: latestIn("general"),
	product: justBefore("prod-mention"),
	design: latestIn("design"),
	engineering: justBefore("eng-budget"),
	announcements: latestIn("announcements"),
	random: justBefore("rand-coffee"),
	"dm-priya": latestIn("dm-priya"),
	"dm-noah": latestIn("dm-noah"),
	"dm-kai": justBefore("dm-k1"),
	"dm-avery": latestIn("dm-avery"),
	"dm-launch": latestIn("dm-launch"),
	"lumen-general": latestIn("lumen-general")
};
var AVATAR_CLASS = {
	u_me: "bg-avatar-alex",
	priya: "bg-avatar-priya",
	noah: "bg-avatar-noah",
	jules: "bg-avatar-jules",
	lena: "bg-avatar-lena",
	samir: "bg-avatar-samir",
	avery: "bg-avatar-avery",
	kai: "bg-avatar-kai",
	mina: "bg-avatar-mina",
	theo: "bg-avatar-theo"
};
var FIVE_MINUTES = 3e5;
function userById(id) {
	return USERS.find((user) => user.id === id) ?? {
		id,
		name: "Unknown teammate",
		handle: "unknown",
		initials: "?",
		title: "",
		presence: "offline"
	};
}
function presenceOf(userId, selfPresence) {
	if (userId === "u_me") return selfPresence;
	return userById(userId).presence;
}
function presenceLabel(presence) {
	if (presence === "online") return "Available";
	if (presence === "away") return "Away";
	return "Offline";
}
function conversationsOf(extra) {
	return [...SEED_CONVERSATIONS, ...extra];
}
function assembleMessages(state) {
	const deleted = new Set(state.deletedIds);
	return [...SEED_MESSAGES, ...state.createdMessages].filter((message) => !deleted.has(message.id)).map((message) => {
		const edit = state.edited[message.id];
		const reactions = state.reactionOverrides[message.id] ?? message.reactions;
		if (!edit) return {
			...message,
			reactions
		};
		return {
			...message,
			body: edit.body,
			editedAt: edit.editedAt,
			reactions
		};
	}).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
function conversationById(conversations, id) {
	return conversations.find((conversation) => conversation.id === id) ?? null;
}
function memberIds(conversation) {
	return conversation.kind === "channel" ? conversation.memberIds : conversation.participantIds;
}
function conversationTitle(conversation) {
	if (conversation.kind === "channel") return conversation.name;
	if (conversation.title) return conversation.title;
	return conversation.participantIds.filter((id) => id !== "u_me").map((id) => userById(id).name).join(", ") || "You";
}
function peopleLabel(ids) {
	const names = ids.filter((id) => id !== YOU).map((id) => userById(id).name);
	if (names.length === 0) return "Just you";
	if (names.length === 1) return names[0] ?? "Just you";
	if (names.length === 2) return `${names[0]} and ${names[1]}`;
	return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
function threadReplies(messages, parentId) {
	return messages.filter((message) => message.parentId === parentId);
}
function replyCount(messages, parentId) {
	return threadReplies(messages, parentId).length;
}
function unreadMeta(messages, conversationId, lastRead) {
	const cutoff = lastRead ? new Date(lastRead).getTime() : 0;
	return { unread: messages.filter((message) => message.conversationId === conversationId && !message.system && message.authorId !== "u_me" && new Date(message.createdAt).getTime() > cutoff).length };
}
function mentionBadge(messages, conversationId, readIds) {
	const read = new Set(readIds);
	return activityItems(messages).filter((item) => item.kind === "mention" && item.conversationId === conversationId && !read.has(item.id)).length;
}
function groupMessages(messages) {
	const groups = [];
	for (const message of messages) {
		const last = groups[groups.length - 1];
		const prev = last?.messages[last.messages.length - 1];
		if (prev && last && !message.system && !prev.system && last.authorId === message.authorId && new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime() < FIVE_MINUTES && new Date(message.createdAt).toDateString() === new Date(prev.createdAt).toDateString() && last) last.messages.push(message);
		else groups.push({
			id: message.id,
			authorId: message.authorId,
			messages: [message]
		});
	}
	return groups;
}
function dayLabel(iso) {
	const date = new Date(iso);
	if (isToday(date)) return "Today";
	if (isYesterday(date)) return "Yesterday";
	return format(date, "EEEE, MMM d");
}
function timeLabel(iso) {
	return format(new Date(iso), "h:mm a");
}
function gutterTime(iso) {
	return format(new Date(iso), "h:mm");
}
function absoluteTime(iso) {
	return format(new Date(iso), "EEEE, MMMM d, yyyy 'at' h:mm a");
}
function bucketByDay(messages) {
	const buckets = [];
	for (const message of messages) {
		const key = new Date(message.createdAt).toDateString();
		const last = buckets[buckets.length - 1];
		if (last?.key === key) last.messages.push(message);
		else buckets.push({
			key,
			label: dayLabel(message.createdAt),
			messages: [message]
		});
	}
	return buckets;
}
function formatBytes(size) {
	if (size < 1024) return `${size} B`;
	if (size < 1048576) return `${Math.round(size / 1024)} KB`;
	return `${(size / 1048576).toFixed(1)} MB`;
}
function slugify(value) {
	return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}
function initialsFor(name) {
	return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "OR";
}
function activityItems(messages) {
	const participated = new Set(messages.filter((message) => message.authorId === "u_me" && message.parentId).map((message) => message.parentId));
	const items = [];
	for (const message of messages) {
		if (message.authorId === "u_me") continue;
		const handle = userById(YOU).handle;
		const mention = new RegExp(`@${handle}\\b`, "i").test(message.body);
		const threadUpdate = Boolean(message.parentId && (participated.has(message.parentId) || mention));
		if (!mention && !threadUpdate) continue;
		items.push({
			id: message.id,
			kind: mention ? "mention" : "thread",
			message,
			conversationId: message.conversationId
		});
	}
	return items.sort((a, b) => b.message.createdAt.localeCompare(a.message.createdAt)).slice(0, 8);
}
function snippet(body, max = 140) {
	const flat = body.replace(/\s+/g, " ").trim();
	if (flat.length <= max) return flat;
	return `${flat.slice(0, max - 1).trimEnd()}…`;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var FALLBACK_TONES = [
	"bg-avatar-priya",
	"bg-avatar-noah",
	"bg-avatar-jules",
	"bg-avatar-lena",
	"bg-avatar-avery"
];
function avatarClass(id) {
	if (AVATAR_CLASS[id]) return AVATAR_CLASS[id];
	return FALLBACK_TONES[Math.abs(id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % FALLBACK_TONES.length] ?? "bg-avatar-samir";
}
function PresenceMark({ presence, className }) {
	const label = presenceLabel(presence);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("absolute -right-0.5 -bottom-0.5 size-2.5 border border-paper", className, {
			"rounded-full bg-online": presence === "online",
			"rounded-full border-2 border-away bg-paper": presence === "away",
			"rounded-sm border-ink-faint bg-paper": presence === "offline"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: label
		})
	});
}
function Avatar({ userId, selfPresence, size = "md", showPresence = false }) {
	const user = userById(userId);
	const presence = presenceOf(userId, selfPresence ?? user.presence);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative inline-flex shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("inline-flex items-center justify-center rounded-md font-semibold text-paper", avatarClass(userId), size === "sm" ? "size-6 text-xs" : "size-9 text-sm"),
			"aria-hidden": "true",
			children: user.initials
		}), showPresence ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresenceMark, { presence }) : null]
	});
}
var EMPTY_PERSISTED = () => ({
	workspaceId: "orbit",
	conversationId: "general",
	threadParentId: null,
	view: "conversation",
	drafts: {},
	draftAttachments: {},
	savedIds: [],
	savedAt: {},
	activityReadIds: [],
	callHistory: [],
	collapsed: {
		channels: false,
		dms: false
	},
	lastRead: { ...INITIAL_LAST_READ },
	lastChannel: {
		orbit: "general",
		lumen: "lumen-general"
	},
	lastDm: { orbit: "dm-priya" },
	createdMessages: [],
	edited: {},
	deletedIds: [],
	reactionOverrides: {},
	presence: "online",
	status: "Launch desk",
	alwaysShowTime: false,
	extraWorkspaces: [],
	extraConversations: []
});
function snapshot(state) {
	return {
		workspaceId: state.workspaceId,
		conversationId: state.conversationId,
		threadParentId: state.threadParentId,
		view: state.view,
		drafts: state.drafts,
		draftAttachments: state.draftAttachments,
		savedIds: state.savedIds,
		savedAt: state.savedAt,
		activityReadIds: state.activityReadIds,
		callHistory: state.callHistory,
		collapsed: state.collapsed,
		lastRead: state.lastRead,
		lastChannel: state.lastChannel,
		lastDm: state.lastDm,
		createdMessages: state.createdMessages,
		edited: state.edited,
		deletedIds: state.deletedIds,
		reactionOverrides: state.reactionOverrides,
		presence: state.presence,
		status: state.status,
		alwaysShowTime: state.alwaysShowTime,
		extraWorkspaces: state.extraWorkspaces,
		extraConversations: state.extraConversations
	};
}
function persist(get) {
	if (!get().hydrated || typeof localStorage === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot(get())));
}
function readPersisted() {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return null;
		return parsed;
	} catch {
		return null;
	}
}
var useOrbit = create((set, get) => ({
	...EMPTY_PERSISTED(),
	hydrated: false,
	highlightId: null,
	searchOpen: false,
	searchScopeId: null,
	searchReturn: null,
	threadReturn: null,
	recentIds: [],
	menu: null,
	navOpen: false,
	channelDialog: false,
	workspaceDialog: false,
	statusDialog: false,
	prefsDialog: false,
	call: null,
	callSwitch: null,
	liveMessage: "",
	announce: (message) => set({ liveMessage: message }),
	hydrate: () => {
		if (get().hydrated) return;
		const base = EMPTY_PERSISTED();
		const saved = readPersisted();
		const next = saved ? {
			...base,
			...saved,
			drafts: saved.drafts ?? base.drafts,
			draftAttachments: saved.draftAttachments ?? base.draftAttachments,
			savedIds: saved.savedIds ?? base.savedIds,
			savedAt: saved.savedAt ?? base.savedAt,
			activityReadIds: saved.activityReadIds ?? base.activityReadIds,
			callHistory: saved.callHistory ?? base.callHistory,
			collapsed: {
				channels: false,
				dms: false
			},
			lastRead: {
				...base.lastRead,
				...saved.lastRead
			},
			lastChannel: {
				...base.lastChannel,
				...saved.lastChannel
			},
			lastDm: {
				...base.lastDm,
				...saved.lastDm
			},
			createdMessages: saved.createdMessages ?? [],
			edited: saved.edited ?? {},
			deletedIds: saved.deletedIds ?? [],
			reactionOverrides: saved.reactionOverrides ?? {},
			extraWorkspaces: saved.extraWorkspaces ?? [],
			extraConversations: saved.extraConversations ?? [],
			presence: saved.presence ?? base.presence,
			status: saved.status ?? base.status,
			alwaysShowTime: saved.alwaysShowTime ?? false,
			view: saved.view ?? "conversation",
			threadParentId: saved.threadParentId ?? null,
			workspaceId: saved.workspaceId ?? base.workspaceId,
			conversationId: saved.conversationId ?? base.conversationId
		} : base;
		if (next.workspaceId !== "orbit") {
			next.workspaceId = "orbit";
			next.conversationId = next.lastChannel.orbit || "general";
			next.threadParentId = null;
		}
		set({
			...next,
			hydrated: true
		});
		if (typeof location !== "undefined" && location.hash.length > 1) {
			const [conversationId, messageId] = location.hash.slice(1).split("/");
			const conversations = conversationsOf(next.extraConversations);
			const conversation = conversationId ? conversationById(conversations, conversationId) : null;
			if (conversation) {
				get().openConversation(conversation.id, { keepThread: Boolean(messageId) });
				if (messageId) get().focusMessage(messageId);
			}
		}
	},
	setWorkspace: (id) => {
		const state = get();
		const conversations = conversationsOf(state.extraConversations).filter((item) => item.workspaceId === id);
		const channel = conversations.find((item) => item.kind === "channel" && item.id === state.lastChannel[id]);
		const fallback = conversations.find((item) => item.kind === "channel") ?? conversations[0];
		const nextId = channel?.id ?? fallback?.id ?? "";
		set({
			workspaceId: id,
			conversationId: nextId,
			threadParentId: null,
			view: "conversation",
			navOpen: false
		});
		if (nextId) get().openConversation(nextId);
		else persist(get);
	},
	openConversation: (id, options) => {
		const state = get();
		const conversation = conversationById(conversationsOf(state.extraConversations), id);
		if (!conversation) return;
		const same = state.conversationId === id;
		const recentIds = [id, ...state.recentIds.filter((item) => item !== id)].slice(0, 8);
		set({
			workspaceId: conversation.workspaceId,
			conversationId: id,
			view: "conversation",
			navOpen: false,
			menu: null,
			searchOpen: false,
			searchScopeId: null,
			recentIds,
			threadParentId: same || options?.keepThread ? state.threadParentId : null,
			lastRead: {
				...state.lastRead,
				[id]: (/* @__PURE__ */ new Date()).toISOString()
			},
			lastChannel: conversation.kind === "channel" ? {
				...state.lastChannel,
				[conversation.workspaceId]: id
			} : state.lastChannel,
			lastDm: conversation.kind === "dm" ? {
				...state.lastDm,
				[conversation.workspaceId]: id
			} : state.lastDm
		});
		persist(get);
		const call = get().call;
		if (call?.phase === "active" && call.conversationId !== id) set({ call: {
			...call,
			surface: "minimized"
		} });
	},
	setView: (view) => {
		set({
			view,
			navOpen: false
		});
		persist(get);
	},
	toggleSection: (key) => {
		const collapsed = {
			...get().collapsed,
			[key]: !get().collapsed[key]
		};
		set({ collapsed });
		if (typeof sessionStorage !== "undefined") sessionStorage.setItem("orbit:collapsed", JSON.stringify(collapsed));
	},
	setDraft: (key, value) => {
		set({ drafts: {
			...get().drafts,
			[key]: value
		} });
		persist(get);
	},
	setDraftAttachments: (key, files) => {
		const draftAttachments = { ...get().draftAttachments };
		if (files.length === 0) delete draftAttachments[key];
		else draftAttachments[key] = files;
		set({ draftAttachments });
		persist(get);
	},
	sendMessage: ({ conversationId, body, parentId, attachments, draftKey }) => {
		const trimmed = body.trim();
		const files = attachments?.filter((file) => file.name) ?? [];
		if (!trimmed && files.length === 0) return;
		const message = {
			id: `m-${crypto.randomUUID()}`,
			conversationId,
			authorId: YOU,
			body: trimmed,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			parentId,
			reactions: [],
			attachments: files.length ? files : void 0
		};
		const drafts = { ...get().drafts };
		delete drafts[draftKey];
		const draftAttachments = { ...get().draftAttachments };
		delete draftAttachments[draftKey];
		set({
			createdMessages: [...get().createdMessages, message],
			drafts,
			draftAttachments,
			lastRead: {
				...get().lastRead,
				[conversationId]: message.createdAt
			},
			liveMessage: parentId ? "Reply sent" : "Message sent"
		});
		persist(get);
	},
	toggleReaction: (messageId, emoji) => {
		const state = get();
		const message = assembleMessages(state).find((item) => item.id === messageId);
		if (!message) return;
		const reactions = message.reactions.map((reaction) => ({
			...reaction,
			userIds: [...reaction.userIds]
		}));
		const existing = reactions.find((reaction) => reaction.emoji === emoji);
		if (existing) existing.userIds = existing.userIds.includes("u_me") ? existing.userIds.filter((id) => id !== YOU) : [...existing.userIds, YOU];
		else reactions.push({
			emoji,
			userIds: [YOU]
		});
		set({ reactionOverrides: {
			...state.reactionOverrides,
			[messageId]: reactions.filter((reaction) => reaction.userIds.length > 0)
		} });
		persist(get);
	},
	toggleSaved: (messageId) => {
		const state = get();
		if (state.deletedIds.includes(messageId)) return;
		const saved = state.savedIds.includes(messageId);
		const savedAt = { ...state.savedAt };
		if (saved) delete savedAt[messageId];
		else savedAt[messageId] = (/* @__PURE__ */ new Date()).toISOString();
		set({
			savedIds: saved ? state.savedIds.filter((id) => id !== messageId) : [messageId, ...state.savedIds],
			savedAt,
			liveMessage: saved ? "Removed from Later" : "Saved for later"
		});
		persist(get);
	},
	editMessage: (messageId, body) => {
		const trimmed = body.trim();
		if (!trimmed) return;
		set({ edited: {
			...get().edited,
			[messageId]: {
				body: trimmed,
				editedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		} });
		persist(get);
	},
	deleteMessage: (messageId) => {
		if (get().deletedIds.includes(messageId)) return;
		const savedAt = { ...get().savedAt };
		delete savedAt[messageId];
		set({
			deletedIds: [...get().deletedIds, messageId],
			savedIds: get().savedIds.filter((id) => id !== messageId),
			savedAt,
			liveMessage: "Message deleted"
		});
		persist(get);
	},
	undoDelete: (messageId) => {
		set({ deletedIds: get().deletedIds.filter((id) => id !== messageId) });
		persist(get);
	},
	openThread: (parentId) => {
		set({
			threadParentId: parentId,
			view: "conversation",
			threadReturn: document.activeElement instanceof HTMLElement ? document.activeElement : get().threadReturn
		});
		persist(get);
	},
	closeThread: () => {
		const threadReturn = get().threadReturn;
		set({
			threadParentId: null,
			threadReturn: null
		});
		persist(get);
		window.setTimeout(() => {
			if (threadReturn && document.contains(threadReturn)) threadReturn.focus();
			else document.getElementById("composer")?.focus();
		}, 0);
	},
	highlight: (messageId) => {
		set({ highlightId: messageId });
		window.setTimeout(() => {
			if (get().highlightId === messageId) set({ highlightId: null });
		}, 2e3);
	},
	focusMessage: (messageId) => {
		const state = get();
		const message = assembleMessages(state).find((item) => item.id === messageId);
		if (!message) return;
		const conversation = conversationById(conversationsOf(state.extraConversations), message.conversationId);
		if (!conversation) return;
		const recentIds = [conversation.id, ...state.recentIds.filter((item) => item !== conversation.id)].slice(0, 8);
		set({
			workspaceId: conversation.workspaceId,
			conversationId: conversation.id,
			view: "conversation",
			navOpen: false,
			recentIds,
			threadParentId: message.parentId ?? null,
			lastRead: {
				...state.lastRead,
				[conversation.id]: (/* @__PURE__ */ new Date()).toISOString()
			},
			lastChannel: conversation.kind === "channel" ? {
				...state.lastChannel,
				[conversation.workspaceId]: conversation.id
			} : state.lastChannel,
			lastDm: conversation.kind === "dm" ? {
				...state.lastDm,
				[conversation.workspaceId]: conversation.id
			} : state.lastDm,
			highlightId: message.id
		});
		persist(get);
		window.setTimeout(() => {
			if (get().highlightId === message.id) set({ highlightId: null });
		}, 2e3);
	},
	openActivity: (messageId) => {
		const state = get();
		if (state.deletedIds.includes(messageId)) return;
		if (!assembleMessages(state).find((item) => item.id === messageId)) return;
		if (!state.activityReadIds.includes(messageId)) {
			set({ activityReadIds: [...state.activityReadIds, messageId] });
			persist(get);
		}
		get().focusMessage(messageId);
	},
	markActivityRead: () => {
		const ids = activityItems(assembleMessages(get())).map((item) => item.id);
		set({
			activityReadIds: [.../* @__PURE__ */ new Set([...get().activityReadIds, ...ids])],
			liveMessage: "Activity marked read"
		});
		persist(get);
	},
	openSearch: (scopeId = null) => {
		const current = get();
		set({
			searchOpen: true,
			searchScopeId: scopeId,
			menu: null,
			searchReturn: current.searchOpen ? current.searchReturn : document.activeElement instanceof HTMLElement ? document.activeElement : null
		});
	},
	setSearchOpen: (searchOpen) => {
		const searchReturn = get().searchReturn;
		set({
			searchOpen,
			searchScopeId: searchOpen ? get().searchScopeId : null,
			searchReturn: searchOpen ? searchReturn : null
		});
		if (!searchOpen && searchReturn && document.contains(searchReturn)) window.setTimeout(() => searchReturn.focus(), 0);
	},
	setMenu: (menu) => set({ menu }),
	setNavOpen: (navOpen) => set({ navOpen }),
	setChannelDialog: (channelDialog) => set({ channelDialog }),
	setWorkspaceDialog: (workspaceDialog) => set({ workspaceDialog }),
	setStatusDialog: (statusDialog) => set({ statusDialog }),
	setPrefsDialog: (prefsDialog) => set({ prefsDialog }),
	setPresence: (presence) => {
		set({ presence });
		persist(get);
	},
	setStatus: (status) => {
		set({ status: status.trim() });
		persist(get);
	},
	setAlwaysShowTime: (alwaysShowTime) => {
		set({ alwaysShowTime });
		persist(get);
	},
	createWorkspace: (name) => {
		const trimmed = name.trim();
		if (!trimmed) return "Name the workspace first.";
		const state = get();
		const id = `ws-${slugify(trimmed) || "team"}-${Math.random().toString(36).slice(2, 6)}`;
		const workspace = {
			id,
			name: trimmed,
			initials: initialsFor(trimmed)
		};
		const channel = {
			kind: "channel",
			id: `${id}-general`,
			workspaceId: id,
			name: "general",
			description: `Home for ${trimmed}.`,
			memberIds: [YOU]
		};
		set({
			extraWorkspaces: [...state.extraWorkspaces, workspace],
			extraConversations: [...state.extraConversations, channel],
			workspaceDialog: false
		});
		get().setWorkspace(id);
		return null;
	},
	createChannel: (name, description) => {
		const slug = slugify(name);
		if (!slug) return "Use letters or numbers in the channel name.";
		const state = get();
		if (conversationsOf(state.extraConversations).some((item) => item.workspaceId === state.workspaceId && item.kind === "channel" && item.name === slug)) return "That channel already exists here.";
		const channel = {
			kind: "channel",
			id: `${state.workspaceId}-${slug}-${Math.random().toString(36).slice(2, 6)}`,
			workspaceId: state.workspaceId,
			name: slug,
			description: description.trim() || "New channel",
			memberIds: [YOU]
		};
		set({
			extraConversations: [...state.extraConversations, channel],
			channelDialog: false
		});
		get().openConversation(channel.id);
		return null;
	},
	goHome: () => {
		get().openConversation("general");
	},
	goDms: () => {
		const state = get();
		const conversations = conversationsOf(state.extraConversations).filter((item) => item.workspaceId === state.workspaceId && item.kind === "dm");
		const next = conversations.find((item) => item.id === state.lastDm[state.workspaceId]) ?? conversations[0];
		if (next) get().openConversation(next.id);
		else {
			set({
				view: "conversation",
				conversationId: "",
				threadParentId: null,
				navOpen: false
			});
			persist(get);
		}
	},
	resetDemo: () => {
		if (typeof localStorage !== "undefined") localStorage.removeItem(STORAGE_KEY);
		set({
			...EMPTY_PERSISTED(),
			hydrated: true,
			highlightId: null,
			searchOpen: false,
			searchScopeId: null,
			searchReturn: null,
			threadReturn: null,
			recentIds: [],
			menu: null,
			navOpen: false,
			channelDialog: false,
			workspaceDialog: false,
			statusDialog: false,
			prefsDialog: false,
			call: null,
			callSwitch: null
		});
	},
	requestCall: (conversationId, kind) => {
		const state = get();
		const conversation = conversationById(conversationsOf(state.extraConversations), conversationId);
		if (!conversation || conversation.kind !== "dm") return;
		if (memberIds(conversation).length > 8) {
			set({ liveMessage: "Calls are limited to 8 people in this demo." });
			return;
		}
		if (state.call && !(state.call.conversationId === conversationId && state.call.kind === kind)) {
			set({ callSwitch: {
				conversationId,
				kind
			} });
			return;
		}
		if (state.call) {
			set({
				call: {
					...state.call,
					surface: "open"
				},
				callSwitch: null
			});
			return;
		}
		stopCallTracks();
		set({
			callSwitch: null,
			call: {
				id: `call-${crypto.randomUUID()}`,
				conversationId,
				kind,
				phase: "lobby",
				startedAt: null,
				surface: "open",
				mic: "idle",
				camera: "idle",
				micDetail: null,
				cameraDetail: null
			}
		});
	},
	cancelLobby: () => {
		const call = get().call;
		if (!call || call.phase !== "lobby") return;
		stopCallTracks();
		set({ call: null });
	},
	enablePreview: async () => {
		const call = get().call;
		if (!call || call.kind !== "video" || call.phase !== "lobby") return;
		set({ call: {
			...call,
			camera: "requesting",
			cameraDetail: null
		} });
		try {
			await captureMedia(false, true);
			const current = get().call;
			if (!current || current.id !== call.id) return;
			set({ call: {
				...current,
				camera: "live",
				cameraDetail: null
			} });
		} catch (error) {
			const current = get().call;
			if (!current || current.id !== call.id) return;
			const missing = error instanceof DOMException && (error.name === "NotFoundError" || error.name === "DevicesNotFoundError");
			set({ call: {
				...current,
				camera: missing ? "unavailable" : "denied",
				cameraDetail: explainMediaError(error, "camera")
			} });
		}
	},
	joinDemoCall: async (options) => {
		const call = get().call;
		if (!call || call.phase !== "lobby") return;
		const wantMic = !options?.withoutMic;
		const wantCamera = call.kind === "video" && !options?.withoutCamera;
		set({ call: {
			...call,
			mic: wantMic ? "requesting" : "muted",
			camera: wantCamera ? "requesting" : call.camera === "live" ? "live" : "muted",
			micDetail: null
		} });
		try {
			if (wantMic || wantCamera && call.camera !== "live") await captureMedia(wantMic, wantCamera && call.camera !== "live");
			const current = get().call;
			if (!current || current.id !== call.id) return;
			const startedAt = Date.now();
			set({ call: {
				...current,
				phase: "active",
				startedAt,
				surface: "open",
				mic: wantMic ? "live" : "muted",
				camera: wantCamera || current.camera === "live" ? "live" : "muted",
				micDetail: null,
				cameraDetail: null
			} });
			sessionStorage.setItem("orbit:live-call", JSON.stringify({
				id: current.id,
				conversationId: current.conversationId,
				kind: current.kind,
				startedAt
			}));
		} catch (error) {
			const current = get().call;
			if (!current || current.id !== call.id) return;
			const missing = error instanceof DOMException && (error.name === "NotFoundError" || error.name === "DevicesNotFoundError");
			set({ call: {
				...current,
				phase: "lobby",
				mic: wantMic ? missing ? "unavailable" : "denied" : "muted",
				camera: wantCamera ? missing ? "unavailable" : "denied" : current.camera,
				micDetail: wantMic ? explainMediaError(error, "microphone") : null,
				cameraDetail: wantCamera ? explainMediaError(error, "camera") : current.cameraDetail
			} });
		}
	},
	retryDevice: async (device) => {
		const call = get().call;
		if (!call) return;
		if (device === "mic") {
			set({ call: {
				...call,
				mic: "requesting",
				micDetail: null
			} });
			try {
				await captureMedia(true, false);
				const current = get().call;
				if (!current) return;
				set({ call: {
					...current,
					mic: "live",
					micDetail: null
				} });
			} catch (error) {
				const current = get().call;
				if (!current) return;
				const missing = error instanceof DOMException && (error.name === "NotFoundError" || error.name === "DevicesNotFoundError");
				set({ call: {
					...current,
					mic: missing ? "unavailable" : "denied",
					micDetail: explainMediaError(error, "microphone")
				} });
			}
			return;
		}
		set({ call: {
			...call,
			camera: "requesting",
			cameraDetail: null
		} });
		try {
			await captureMedia(false, true);
			const current = get().call;
			if (!current) return;
			set({ call: {
				...current,
				camera: "live",
				cameraDetail: null
			} });
		} catch (error) {
			const current = get().call;
			if (!current) return;
			const missing = error instanceof DOMException && (error.name === "NotFoundError" || error.name === "DevicesNotFoundError");
			set({ call: {
				...current,
				camera: missing ? "unavailable" : "denied",
				cameraDetail: explainMediaError(error, "camera")
			} });
		}
	},
	toggleMute: async () => {
		const call = get().call;
		if (!call || call.phase !== "active") return;
		if (call.mic === "live") {
			setTrackEnabled("audio", false);
			set({ call: {
				...call,
				mic: "muted"
			} });
			return;
		}
		if (call.mic === "muted") {
			const { localTracks } = await import("./media-3G1mNnON.mjs");
			if (localTracks().audio) {
				setTrackEnabled("audio", true);
				set({ call: {
					...get().call,
					mic: "live",
					micDetail: null
				} });
				return;
			}
			await get().retryDevice("mic");
		}
	},
	toggleCamera: async () => {
		const call = get().call;
		if (!call || call.phase !== "active" || call.kind !== "video") return;
		if (call.camera === "live") {
			setTrackEnabled("video", false);
			set({ call: {
				...call,
				camera: "muted"
			} });
			return;
		}
		const { localTracks } = await import("./media-3G1mNnON.mjs");
		if (localTracks().video) {
			setTrackEnabled("video", true);
			set({ call: {
				...get().call,
				camera: "live",
				cameraDetail: null
			} });
			return;
		}
		await get().retryDevice("camera");
	},
	endCall: () => {
		const call = get().call;
		stopCallTracks();
		sessionStorage.removeItem("orbit:live-call");
		if (!call) return;
		if (call.phase === "active" && call.startedAt != null) recordCall(set, get, call);
		set({
			call: null,
			callSwitch: null
		});
	},
	minimizeCall: () => {
		const call = get().call;
		if (!call || call.phase !== "active") return;
		set({ call: {
			...call,
			surface: "minimized"
		} });
	},
	returnToCall: () => {
		const call = get().call;
		if (!call) {
			set({ callSwitch: null });
			return;
		}
		set({
			call: {
				...call,
				surface: "open"
			},
			callSwitch: null
		});
		get().openConversation(call.conversationId);
	},
	confirmCallSwitch: () => {
		const next = get().callSwitch;
		if (!next) return;
		get().endCall();
		get().requestCall(next.conversationId, next.kind);
	},
	dismissCallSwitch: () => set({ callSwitch: null })
}));
var LIVE_CALL_KEY = "orbit:live-call";
function recoverInterruptedCall() {
	if (typeof sessionStorage === "undefined") return;
	const raw = sessionStorage.getItem(LIVE_CALL_KEY);
	sessionStorage.removeItem(LIVE_CALL_KEY);
	if (!raw) return;
	try {
		const saved = JSON.parse(raw);
		if (!saved.id || !saved.conversationId || !saved.startedAt) return;
		if (useOrbit.getState().createdMessages.some((message) => message.id === `history-${saved.id}`)) return;
		const endedAt = Date.now();
		recordCall((partial) => useOrbit.setState(partial), useOrbit.getState, {
			id: saved.id,
			conversationId: saved.conversationId,
			kind: saved.kind,
			phase: "active",
			startedAt: saved.startedAt,
			surface: "open",
			mic: "idle",
			camera: "idle",
			micDetail: null,
			cameraDetail: null
		}, endedAt);
	} catch {}
}
function recordCall(set, get, call, endedAtMs = Date.now()) {
	if (call.startedAt == null) return;
	const historyId = `history-${call.id}`;
	if (get().createdMessages.some((message) => message.id === historyId)) return;
	const durationSec = Math.max(0, Math.floor((endedAtMs - call.startedAt) / 1e3));
	const startedAt = new Date(call.startedAt).toISOString();
	const endedAt = new Date(endedAtMs).toISOString();
	const item = {
		id: historyId,
		conversationId: call.conversationId,
		kind: call.kind,
		initiatorId: YOU,
		startedAt,
		endedAt,
		durationSec
	};
	const label = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`;
	const noun = call.kind === "video" ? "Video call" : "Voice call";
	const message = {
		id: historyId,
		conversationId: call.conversationId,
		authorId: "system",
		body: `${noun} ended · ${label}`,
		createdAt: endedAt,
		reactions: [],
		system: true
	};
	set({
		createdMessages: [...get().createdMessages, message],
		callHistory: [...get().callHistory, item]
	});
	persist(get);
}
function CallRuntime() {
	(0, import_react.useEffect)(() => {
		recoverInterruptedCall();
		const end = () => {
			if (useOrbit.getState().call?.phase === "active") useOrbit.getState().endCall();
		};
		window.addEventListener("pagehide", end);
		return () => window.removeEventListener("pagehide", end);
	}, []);
	return null;
}
function CallReturnBar() {
	const call = useOrbit((state) => state.call);
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const visible = Boolean(call && call.phase === "active" && call.surface === "minimized");
	(0, import_react.useEffect)(() => {
		if (!visible) return;
		const timer = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(timer);
	}, [visible]);
	if (!call || !visible || call.startedAt == null) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-12 shrink-0 items-center gap-2 border-b border-line bg-plum px-3 text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
				className: "size-4 shrink-0",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "min-w-0 flex-1 truncate text-sm font-medium",
				children: [
					"Demo ",
					call.kind,
					" call · ",
					clock(now - call.startedAt)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "rounded-md px-3 py-2 text-sm font-semibold hover:bg-plum-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
				onClick: () => useOrbit.getState().returnToCall(),
				children: "Return to call"
			})
		]
	});
}
function CallSurfaces() {
	const call = useOrbit((state) => state.call);
	const callSwitch = useOrbit((state) => state.callSwitch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [call && call.surface === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallDialog, { call }) : null, callSwitch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchDialog, {}) : null] });
}
function CallDialog({ call }) {
	const conversation = conversationById(conversationsOf(useOrbit((state) => state.extraConversations)), call.conversationId);
	const title = conversation ? conversationTitle(conversation) : "Conversation";
	const others = conversation ? memberIds(conversation).filter((id) => id !== YOU) : [];
	const heading = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		heading.current?.focus();
	}, [call.phase, call.id]);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			if (event.key !== "Escape") return;
			if (call.phase === "lobby") useOrbit.getState().cancelLobby();
			else useOrbit.getState().minimizeCall();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [call.phase]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4",
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "call-title",
			className: "flex max-h-[100dvh] w-full flex-col bg-paper text-ink shadow-pop sm:max-h-[90dvh] sm:max-w-3xl sm:rounded-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start gap-3 border-b border-line px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-wide text-accent uppercase",
							children: "Demo call"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							id: "call-title",
							ref: heading,
							tabIndex: -1,
							className: "truncate text-lg font-semibold outline-none",
							children: [
								call.kind === "video" ? "Video" : "Voice",
								" · ",
								title
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink-soft",
							children: "Demo call — other participants are simulated."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex h-11 items-center rounded-md px-3 text-sm font-medium hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
					onClick: () => call.phase === "lobby" ? useOrbit.getState().cancelLobby() : useOrbit.getState().minimizeCall(),
					children: call.phase === "lobby" ? "Cancel" : "Hide"
				})]
			}), call.phase === "lobby" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lobby, {
				call,
				others
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActiveCall, {
				call,
				others
			})]
		})
	});
}
function Lobby({ call, others }) {
	const videoRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const node = videoRef.current;
		const track = localTracks().video;
		if (!node || !track) return;
		node.srcObject = new MediaStream([track]);
		return () => {
			node.srcObject = null;
		};
	}, [call.camera]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-ink-soft",
				children: [
					"Invitees: ",
					others.map((id) => userById(id).name).join(", ") || "Just you",
					". Simulated participants will not hear or see you."
				]
			}),
			call.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-lg bg-plum",
				children: [call.camera === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					autoPlay: true,
					playsInline: true,
					muted: true,
					className: "aspect-video w-full -scale-x-100 object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex aspect-video items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						userId: YOU,
						size: "md"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: buttonClass,
						onClick: () => void useOrbit.getState().enablePreview(),
						children: call.camera === "requesting" ? "Requesting camera…" : "Enable preview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-plum-muted",
						children: "Device permission is requested only after you enable preview or join."
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { call }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
						onClick: () => void useOrbit.getState().joinDemoCall(),
						children: call.mic === "requesting" || call.camera === "requesting" ? "Requesting access…" : "Join demo call"
					}),
					call.mic === "denied" || call.mic === "unavailable" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: buttonClass,
						onClick: () => void useOrbit.getState().joinDemoCall({ withoutMic: true }),
						children: "Join without microphone"
					}) : null,
					call.kind === "video" && (call.camera === "denied" || call.camera === "unavailable") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: buttonClass,
						onClick: () => void useOrbit.getState().joinDemoCall({ withoutCamera: true }),
						children: "Join without camera"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: buttonClass,
						onClick: () => useOrbit.getState().cancelLobby(),
						children: "Cancel"
					})
				]
			})
		]
	});
}
function ActiveCall({ call, others }) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const videoRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(timer);
	}, []);
	(0, import_react.useEffect)(() => {
		const node = videoRef.current;
		const track = localTracks().video;
		if (!node) return;
		if (!track || call.camera !== "live") {
			node.srcObject = null;
			return;
		}
		node.srcObject = new MediaStream([track]);
		return () => {
			node.srcObject = null;
		};
	}, [call.camera]);
	const elapsed = call.startedAt ? clock(now - call.startedAt) : "0:00";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg bg-plum p-3 text-paper",
					children: [
						call.kind === "video" && call.camera === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: videoRef,
							autoPlay: true,
							playsInline: true,
							muted: true,
							className: "aspect-video w-full -scale-x-100 rounded-md object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							userId: YOU,
							size: "md"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Alex Morgan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-plum-muted",
							children: [call.mic === "live" ? "Microphone on" : "Muted", " · You"]
						})
					]
				}), others.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg bg-plum-raised p-3 text-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							userId: id,
							size: "md"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-full truncate text-sm font-semibold",
							children: userById(id).name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-xs text-plum-muted",
							children: "Simulated participant — no live video"
						})
					]
				}, id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { call }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-t border-line px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mr-auto text-sm font-semibold tabular-nums",
						children: elapsed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: buttonClass,
						"aria-pressed": call.mic !== "live",
						onClick: () => void useOrbit.getState().toggleMute(),
						children: [call.mic === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-4" }), call.mic === "live" ? "Mute" : "Unmute"]
					}),
					call.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: buttonClass,
						"aria-pressed": call.camera !== "live",
						onClick: () => void useOrbit.getState().toggleCamera(),
						children: [call.camera === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "size-4" }), call.camera === "live" ? "Camera off" : "Camera on"]
					}) : null,
					(call.mic === "denied" || call.mic === "unavailable") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: buttonClass,
						onClick: () => void useOrbit.getState().retryDevice("mic"),
						children: "Retry microphone"
					}),
					call.kind === "video" && (call.camera === "denied" || call.camera === "unavailable") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: buttonClass,
						onClick: () => void useOrbit.getState().retryDevice("camera"),
						children: "Retry camera"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "inline-flex h-11 items-center gap-1 rounded-md bg-danger px-3 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
						onClick: () => useOrbit.getState().endCall(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, {
							className: "size-4",
							"aria-hidden": "true"
						}), "End call"]
					})
				]
			})
		]
	});
}
function Status({ call }) {
	const lines = [call.micDetail, call.cameraDetail].filter(Boolean);
	if (lines.length === 0 && call.mic !== "requesting" && call.camera !== "requesting") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pb-2",
		role: "status",
		children: [
			call.mic === "requesting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "Requesting microphone…"
			}) : null,
			call.camera === "requesting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "Requesting camera…"
			}) : null,
			lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: line
			}, line))
		]
	});
}
function SwitchDialog() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "switch-title",
			className: "w-full max-w-md rounded-xl bg-paper p-5 text-ink shadow-pop",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "switch-title",
					className: "text-lg font-semibold",
					children: "You’re already in a call"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink-soft",
					children: "End the current demo call before starting another. This does not contact anyone else."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: buttonClass,
						onClick: () => useOrbit.getState().returnToCall(),
						children: "Return to current call"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-11 items-center rounded-md bg-danger px-3 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
						onClick: () => useOrbit.getState().confirmCallSwitch(),
						children: "End current call and start new call"
					})]
				})
			]
		})
	});
}
function clock(ms) {
	const total = Math.max(0, Math.floor(ms / 1e3));
	const hours = Math.floor(total / 3600);
	const minutes = Math.floor(total % 3600 / 60);
	const seconds = total % 60;
	if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
var buttonClass = "inline-flex h-11 items-center gap-1 rounded-md border border-line bg-paper px-3 text-sm font-medium text-ink hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
var SESSION_KEY = "orbit:session";
function readSession() {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed.userId !== "u_me" || parsed.mode !== "demo" || typeof parsed.createdAt !== "string") return null;
		return {
			userId: "u_me",
			mode: "demo",
			createdAt: parsed.createdAt
		};
	} catch {
		return null;
	}
}
function writeSession() {
	const session = {
		userId: "u_me",
		mode: "demo",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	return session;
}
function clearSession() {
	localStorage.removeItem(SESSION_KEY);
}
function requestSignOut() {
	window.dispatchEvent(new Event("orbit-signout"));
}
function OrbitMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "3.2",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "16",
				cy: "16",
				rx: "12",
				ry: "5",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.6",
				transform: "rotate(-24 16 16)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "16",
				cy: "16",
				rx: "12",
				ry: "5",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.6",
				transform: "rotate(58 16 16)"
			})
		]
	});
}
var SAMPLE_WORKSPACES = [
	{
		id: "orbit",
		name: "Orbit",
		live: true
	},
	{
		id: "lumen",
		name: "Lumen",
		live: false
	},
	{
		id: "field",
		name: "Field",
		live: false
	}
];
function WorkspaceRail() {
	const presence = useOrbit((state) => state.presence);
	const goHome = useOrbit((state) => state.goHome);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Workspaces",
		className: "flex h-full w-rail shrink-0 flex-col items-center gap-3 bg-plum py-3 text-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full flex-1 flex-col items-center gap-2",
			children: [SAMPLE_WORKSPACES.map((workspace) => workspace.live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-current": "true",
				"aria-label": workspace.name,
				onClick: goHome,
				className: "relative inline-flex size-11 items-center justify-center rounded-lg bg-paper text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -left-3 h-5 w-1 rounded-full bg-paper",
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitMark, { className: "size-6" })]
			}, workspace.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailNotice, {
				label: workspace.name,
				message: "Only Orbit is available in this demo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceGlyph, { id: workspace.id })
			}, workspace.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailNotice, {
				label: "Add a workspace",
				message: "Only Orbit is available in this demo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileMenu, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Your profile",
			className: "relative rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				userId: YOU,
				selfPresence: presence,
				showPresence: true
			})
		}) })]
	});
}
function WorkspaceGlyph({ id }) {
	if (id === "lumen") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: "size-6",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "14",
			cy: "16",
			r: "6",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.7"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M18 10a7 7 0 0 1 0 12",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.7"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: "size-6",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "8",
				width: "6",
				height: "6",
				rx: "1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "18",
				y: "8",
				width: "6",
				height: "6",
				rx: "1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "18",
				width: "6",
				height: "6",
				rx: "1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "18",
				y: "18",
				width: "6",
				height: "6",
				rx: "1",
				fill: "currentColor"
			})
		]
	});
}
function RailNotice({ label, message, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative",
		onMouseEnter: () => setOpen(true),
		onMouseLeave: () => setOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": label,
			onClick: () => setOpen(true),
			onBlur: () => setOpen(false),
			className: "inline-flex size-11 items-center justify-center rounded-lg border border-plum-line bg-plum-raised text-plum-muted hover:bg-plum-hover hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
			children
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			role: "tooltip",
			className: "absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 rounded-md bg-paper px-2 py-1 text-xs font-medium whitespace-nowrap text-ink shadow-pop",
			children: message
		}) : null]
	});
}
function Sidebar({ messages, onNavigate }) {
	const conversationId = useOrbit((state) => state.conversationId);
	const view = useOrbit((state) => state.view);
	const collapsed = useOrbit((state) => state.collapsed);
	const extraConversations = useOrbit((state) => state.extraConversations);
	const lastRead = useOrbit((state) => state.lastRead);
	const activityReadIds = useOrbit((state) => state.activityReadIds);
	const conversations = conversationsOf(extraConversations).filter((item) => item.workspaceId === "orbit");
	const channels = conversations.filter((item) => item.kind === "channel");
	const dms = conversations.filter((item) => item.kind === "dm");
	const current = conversations.find((item) => item.id === conversationId);
	const [mod, setMod] = (0, import_react.useState)("Ctrl");
	(0, import_react.useEffect)(() => {
		setMod(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Sidebar",
		className: "flex h-full min-h-0 w-full flex-col bg-plum-raised text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceMenu, { name: "Orbit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-plum px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-plum-muted uppercase",
					children: "Demo workspace"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						useOrbit.getState().openSearch(null);
						onNavigate?.();
					},
					className: "flex h-11 w-full items-center gap-2 rounded-md border border-plum-line bg-plum px-3 text-left text-sm text-plum-muted hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "size-4",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1",
							children: "Search"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("kbd", {
							className: "rounded-sm border border-plum-line px-1.5 py-0.5 text-xs",
							children: [mod, " K"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-0.5 px-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-4" }),
						label: "Home",
						active: view === "conversation" && current?.kind === "channel",
						onClick: () => {
							useOrbit.getState().goHome();
							onNavigate?.();
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }),
						label: "DMs",
						active: view === "conversation" && (!current || current.kind === "dm"),
						onClick: () => {
							useOrbit.getState().goDms();
							onNavigate?.();
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }),
						label: "Activity",
						active: view === "activity",
						onClick: () => useOrbit.getState().setView("activity")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }),
						label: "Later",
						active: view === "later",
						onClick: () => useOrbit.getState().setView("later")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 min-h-0 flex-1 overflow-y-auto px-2 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "Channels",
					collapsed: collapsed.channels,
					unread: channels.reduce((sum, channel) => sum + unreadMeta(messages, channel.id, lastRead[channel.id]).unread, 0),
					containsActive: view === "conversation" && channels.some((channel) => channel.id === conversationId),
					onToggle: () => useOrbit.getState().toggleSection("channels"),
					onAdd: () => useOrbit.getState().setChannelDialog(true),
					children: channels.map((channel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationButton, {
						conversation: channel,
						active: view === "conversation" && conversationId === channel.id,
						meta: {
							...unreadMeta(messages, channel.id, lastRead[channel.id]),
							mentions: mentionBadge(messages, channel.id, activityReadIds)
						},
						onClick: () => {
							useOrbit.getState().openConversation(channel.id);
							onNavigate?.();
						}
					}, channel.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "Direct messages",
					collapsed: collapsed.dms,
					unread: dms.reduce((sum, dm) => sum + unreadMeta(messages, dm.id, lastRead[dm.id]).unread, 0),
					containsActive: view === "conversation" && dms.some((dm) => dm.id === conversationId),
					onToggle: () => useOrbit.getState().toggleSection("dms"),
					children: dms.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-2 text-sm text-plum-faint",
						children: "No direct messages yet."
					}) : dms.map((dm) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationButton, {
						conversation: dm,
						active: view === "conversation" && conversationId === dm.id,
						meta: {
							...unreadMeta(messages, dm.id, lastRead[dm.id]),
							mentions: mentionBadge(messages, dm.id, activityReadIds)
						},
						onClick: () => {
							useOrbit.getState().openConversation(dm.id);
							onNavigate?.();
						}
					}, dm.id))
				})]
			})
		]
	});
}
function markFromTitle(title) {
	const parts = title.split(/\s+/).filter(Boolean);
	if (parts.length < 2) return (parts[0] ?? "G").slice(0, 2).toUpperCase();
	return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
function NavButton({ icon, label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-current": active ? "page" : void 0,
		onClick,
		className: cn("flex h-11 items-center gap-2 rounded-md px-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper lg:h-9", active ? "bg-paper font-semibold text-ink" : "text-plum-muted hover:bg-plum-hover hover:text-paper"),
		children: [icon, label]
	});
}
function Section({ label, collapsed, unread = 0, containsActive = false, onToggle, onAdd, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-expanded": !collapsed,
				onClick: onToggle,
				className: cn("flex min-w-0 flex-1 items-center gap-1 rounded-md px-1 py-1 text-left text-xs font-semibold tracking-wide uppercase hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper", collapsed && containsActive ? "text-paper" : "text-plum-faint"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-3.5 shrink-0 transition-transform duration-quick", collapsed && "-rotate-90") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: label
					}),
					collapsed && containsActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: ", contains the open conversation"
					}) : null,
					collapsed && unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto inline-flex items-center gap-1 rounded-full bg-paper px-1.5 text-xs font-semibold text-ink tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "sr-only",
							children: [unread, " unread"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: unread
						})]
					}) : null
				]
			}), onAdd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `Add to ${label}`,
				onClick: onAdd,
				className: "inline-flex size-8 items-center justify-center rounded-md text-plum-faint hover:bg-plum-hover hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
			}) : null]
		}), collapsed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 flex flex-col gap-0.5",
			children
		})]
	});
}
function ConversationButton({ conversation, active, meta, onClick }) {
	const presence = useOrbit((state) => state.presence);
	const title = conversationTitle(conversation);
	const unread = meta.unread > 0;
	const flagged = unread || meta.mentions > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-current": active ? "page" : void 0,
		onClick,
		className: cn("flex h-11 w-full items-center gap-2 rounded-md px-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper lg:h-8", active ? "bg-paper font-semibold text-ink" : flagged ? "font-semibold text-paper hover:bg-plum-hover" : "font-medium text-plum-muted hover:bg-plum-hover hover:text-paper"),
		children: [
			conversation.kind === "channel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
				className: "size-3.5 shrink-0",
				"aria-hidden": "true"
			}) : conversation.title || conversation.participantIds.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-plum text-xs font-semibold text-paper",
				children: markFromTitle(conversation.title ?? "Group")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				userId: conversation.participantIds.find((id) => id !== "u_me") ?? "u_me",
				selfPresence: presence,
				size: "sm",
				showPresence: conversation.participantIds.filter((id) => id !== YOU).length === 1
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1 truncate",
				title,
				children: [title, unread || meta.mentions > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "sr-only",
					children: [unread ? `, ${meta.unread} unread` : "", meta.mentions > 0 ? `, ${meta.mentions} mentions` : ""]
				}) : null]
			}),
			flagged ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1",
				children: [
					unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-1.5 rounded-full bg-current",
						"aria-hidden": "true"
					}) : null,
					meta.mentions > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-sm bg-accent px-1 text-xs font-semibold text-accent-ink",
						children: ["@ ", meta.mentions]
					}) : null,
					unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs tabular-nums",
						children: meta.unread
					}) : null
				]
			}) : null
		]
	});
}
function WorkspaceMenu({ name }) {
	const menu = useOrbit((state) => state.menu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, {
		open: menu === "workspace",
		onOpenChange: (open) => useOrbit.getState().setMenu(open ? "workspace" : null),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-w-0 flex-1 items-center gap-1 rounded-md px-1 py-1 text-left text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: "size-4 shrink-0 text-plum-faint",
					"aria-hidden": "true"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
			align: "start",
			className: "orbit-pop z-50 w-64 rounded-lg border border-line bg-paper-raised p-1 text-sm text-ink shadow-pop",
			children: [
				SAMPLE_WORKSPACES.map((workspace) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item2, {
					onSelect: () => {
						if (workspace.live) useOrbit.getState().goHome();
						else toast(`${workspace.name} is coming soon.`);
					},
					className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex size-6 items-center justify-center rounded-md bg-plum text-paper",
							children: workspace.id === "orbit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitMark, { className: "size-4" }) : workspace.name.slice(0, 1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 truncate",
							children: workspace.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-ink-faint",
							children: workspace.live ? "Current" : "Coming soon"
						})
					]
				}, workspace.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, { className: "my-1 h-px bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item2, {
					onSelect: () => toast("Not available in this demo."),
					className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "size-4",
						"aria-hidden": "true"
					}), "Add a workspace"]
				})
			]
		}) })]
	});
}
function ProfileMenu({ children }) {
	const menu = useOrbit((state) => state.menu);
	const presence = useOrbit((state) => state.presence);
	const status = useOrbit((state) => state.status);
	const you = userById(YOU);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, {
		open: menu === "profile",
		onOpenChange: (open) => useOrbit.getState().setMenu(open ? "profile" : null),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
			asChild: true,
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
			side: "right",
			align: "end",
			className: "orbit-pop z-50 w-64 rounded-lg border border-line bg-paper-raised p-1 text-sm text-ink shadow-pop",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: you.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-ink-soft",
						children: [
							you.title,
							" · ",
							presenceLabel(presence),
							status ? ` · ${status}` : ""
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, { className: "my-1 h-px bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup2, {
					value: presence,
					onValueChange: (value) => useOrbit.getState().setPresence(value),
					children: ["online", "away"].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
						value,
						className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line data-[state=checked]:font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex size-4 items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-1.5 rounded-full bg-accent",
								"aria-hidden": "true"
							}) })
						}), presenceLabel(value)]
					}, value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, { className: "my-1 h-px bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuAction, {
					onSelect: () => useOrbit.getState().setStatusDialog(true),
					children: "Set a status"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuAction, {
					onSelect: () => useOrbit.getState().setView("later"),
					children: "Saved for later"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuAction, {
					onSelect: () => useOrbit.getState().setPrefsDialog(true),
					children: "Preferences"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuAction, {
					onSelect: () => {
						if (!window.confirm("Reset demo data on this device? Messages you sent will be removed.")) return;
						useOrbit.getState().resetDemo();
						toast("Demo data restored.");
					},
					children: "Reset demo data"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuAction, {
					onSelect: () => requestSignOut(),
					children: "Sign out"
				})
			]
		}) })]
	});
}
function MenuAction({ children, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		onSelect,
		className: "cursor-pointer rounded-md px-2 py-2 outline-none data-highlighted:bg-line",
		children
	});
}
function MobileNav({ messages }) {
	const open = useOrbit((state) => state.navOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: useOrbit.getState().setNavOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-ink/40 md:hidden" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			"aria-describedby": void 0,
			className: "orbit-pop fixed inset-0 z-50 flex bg-plum outline-none md:hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Navigation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceRail, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
						messages,
						onNavigate: () => useOrbit.getState().setNavOpen(false)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					"aria-label": "Close navigation",
					className: "absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-md text-paper hover:bg-plum-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})
			]
		})] })
	});
}
var MAX_HEIGHT = 192;
var MAX_BODY = 1e4;
var NO_FILES = [];
function Composer({ draftKey, placeholder, fieldId, conversationId, parentId, labelledBy }) {
	const draft = useOrbit((state) => state.drafts[draftKey] ?? "");
	const attachments = useOrbit((state) => state.draftAttachments[draftKey] ?? NO_FILES);
	const setDraft = useOrbit((state) => state.setDraft);
	const setDraftAttachments = useOrbit((state) => state.setDraftAttachments);
	const sendMessage = useOrbit((state) => state.sendMessage);
	const field = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const caret = (0, import_react.useRef)({
		start: 0,
		end: 0
	});
	const [emojiOpen, setEmojiOpen] = (0, import_react.useState)(false);
	const [linkOpen, setLinkOpen] = (0, import_react.useState)(false);
	const [linkUrl, setLinkUrl] = (0, import_react.useState)("https://");
	const [formatOpen, setFormatOpen] = (0, import_react.useState)(true);
	const [fileError, setFileError] = (0, import_react.useState)(null);
	const liveFile = attachments.some((file) => fileUrl(file.id));
	const inputId = fieldId ?? draftKey;
	const canSend = (draft.trim().length > 0 || liveFile) && draft.length <= MAX_BODY;
	(0, import_react.useEffect)(() => {
		const node = field.current;
		if (!node) return;
		node.style.height = "auto";
		node.style.height = `${Math.min(node.scrollHeight, MAX_HEIGHT)}px`;
	}, [draft, draftKey]);
	function remember() {
		const node = field.current;
		if (!node) return;
		caret.current = {
			start: node.selectionStart ?? draft.length,
			end: node.selectionEnd ?? draft.length
		};
	}
	function range() {
		const node = field.current;
		if (node && document.activeElement === node) return {
			start: node.selectionStart ?? 0,
			end: node.selectionEnd ?? 0
		};
		return caret.current;
	}
	function write(next, selection) {
		setDraft(draftKey, next);
		if (selection) caret.current = {
			start: selection[0],
			end: selection[1]
		};
		requestAnimationFrame(() => {
			const node = field.current;
			if (!node) return;
			node.focus();
			if (selection) node.setSelectionRange(selection[0], selection[1]);
		});
	}
	function insert(text) {
		const body = useOrbit.getState().drafts[draftKey] ?? "";
		const { start, end } = range();
		const next = body.slice(0, start) + text + body.slice(end);
		const cursor = start + text.length;
		write(next, [cursor, cursor]);
	}
	function wrap(before, after) {
		const body = useOrbit.getState().drafts[draftKey] ?? "";
		const { start, end } = range();
		const selected = body.slice(start, end);
		const next = `${body.slice(0, start)}${before}${selected}${after}${body.slice(end)}`;
		const cursor = start + before.length;
		write(next, selected ? [cursor, cursor + selected.length] : [cursor, cursor]);
	}
	function send() {
		const raw = useOrbit.getState().drafts[draftKey] ?? "";
		const body = raw.replace(/^(?:[ \t]*\r?\n)+/, "").replace(/(?:\r?\n[ \t]*)+$/, "");
		const files = (useOrbit.getState().draftAttachments[draftKey] ?? []).filter((file) => fileUrl(file.id));
		if (!body.trim() && files.length === 0 || raw.length > MAX_BODY) return;
		sendMessage({
			conversationId,
			body,
			parentId,
			attachments: files,
			draftKey
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-paper-raised focus-within:border-accent",
		children: [
			fileError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 pt-2 text-xs text-danger",
				children: fileError
			}) : null,
			draft.length >= 9e3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-3 pt-2 text-xs text-ink-soft",
				children: [
					draft.length,
					" / ",
					MAX_BODY
				]
			}) : null,
			attachments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-2 px-3 pt-3",
				"aria-label": "Attachments",
				children: attachments.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "inline-flex max-w-full items-center gap-2 rounded-md border border-line bg-paper px-2 py-1 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, {
							className: "size-3.5 shrink-0",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: file.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink-faint tabular-nums",
							children: formatBytes(file.size)
						}),
						fileUrl(file.id) ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink-soft",
							children: "No longer in this session"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-sm p-1 text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
							"aria-label": `Remove ${file.name}`,
							onClick: () => {
								forgetFile(file.id);
								setDraftAttachments(draftKey, attachments.filter((item) => item.id !== file.id));
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
						})
					]
				}, file.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "sr-only",
				htmlFor: inputId,
				children: placeholder
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: inputId,
				ref: field,
				"aria-labelledby": labelledBy,
				rows: 1,
				value: draft,
				placeholder,
				onSelect: remember,
				onKeyUp: remember,
				onBlur: remember,
				onChange: (event) => {
					const value = event.target.value.slice(0, MAX_BODY);
					setDraft(draftKey, value);
					const node = event.target;
					node.style.height = "auto";
					node.style.height = `${Math.min(node.scrollHeight, MAX_HEIGHT)}px`;
				},
				onKeyDown: (event) => {
					if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
						event.preventDefault();
						send();
					}
				},
				className: "max-h-48 min-h-11 w-full resize-none overflow-y-auto bg-transparent px-3 py-3 text-sm leading-normal outline-none placeholder:text-ink-faint"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1 px-2 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2$1, {
						open: emojiOpen,
						onOpenChange: setEmojiOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton, {
								label: "Insert emoji",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
							side: "top",
							align: "start",
							className: "orbit-pop z-50 grid w-64 grid-cols-8 gap-1 rounded-lg border border-line bg-paper-raised p-2 shadow-pop",
							children: EMOJIS.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex size-8 items-center justify-center rounded-md text-base hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
								"aria-label": `Insert ${emoji}`,
								onClick: () => {
									insert(emoji);
									setEmojiOpen(false);
								},
								children: emoji
							}, emoji))
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton, {
						label: "Attach a file",
						onClick: () => fileRef.current?.click(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*,application/pdf,text/plain",
						tabIndex: -1,
						"aria-hidden": "true",
						className: "sr-only",
						onChange: (event) => {
							const file = event.target.files?.[0];
							event.target.value = "";
							if (!file) return;
							const allowed = file.type.startsWith("image/") || file.type === "application/pdf" || file.type === "text/plain";
							if (!allowed || file.size > 10485760) {
								const message = !allowed ? "Choose an image, PDF, or plain text file." : "That file is larger than 10 MB.";
								setFileError(message);
								useOrbit.getState().announce(message);
								return;
							}
							setFileError(null);
							(useOrbit.getState().draftAttachments[draftKey] ?? []).forEach((item) => forgetFile(item.id));
							const id = crypto.randomUUID();
							rememberFile(id, file);
							setDraftAttachments(draftKey, [{
								id,
								name: file.name,
								size: file.size
							}]);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton, {
						label: formatOpen ? "Hide formatting" : "Show formatting",
						"aria-pressed": formatOpen,
						onClick: () => setFormatOpen((value) => !value),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { className: "size-4" })
					}),
					formatOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton, {
							label: "Bold",
							onClick: () => wrap("**", "**"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton, {
							label: "Italic",
							onClick: () => wrap("*", "*"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Italic, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton, {
							label: "Code",
							onClick: () => wrap("`", "`"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2$1, {
							open: linkOpen,
							onOpenChange: setLinkOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton, {
									label: "Insert link",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
								side: "top",
								align: "start",
								className: "orbit-pop z-50 w-72 rounded-lg border border-line bg-paper-raised p-3 shadow-pop",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: (event) => {
										event.preventDefault();
										const url = linkUrl.trim();
										if (!/^https?:\/\//i.test(url)) return;
										const body = useOrbit.getState().drafts[draftKey] ?? "";
										const { start, end } = range();
										const selected = body.slice(start, end);
										const markdown = selected ? `[${selected}](${url})` : `[](${url})`;
										const next = body.slice(0, start) + markdown + body.slice(end);
										const cursor = selected ? start + markdown.length : start + 1;
										write(next, [cursor, cursor]);
										setLinkOpen(false);
										setLinkUrl("https://");
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: `${draftKey}-link`,
											className: "text-xs font-medium text-ink-soft",
											children: "Link address"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: `${draftKey}-link`,
											value: linkUrl,
											onChange: (event) => setLinkUrl(event.target.value),
											className: "mt-1 w-full rounded-md border border-line bg-paper px-2 py-2 text-sm outline-none focus-visible:border-accent"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "mt-2 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
											children: "Insert"
										})
									]
								})
							}) })]
						})
					] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto hidden text-xs text-ink-faint sm:inline",
						children: "Shift + Enter for a new line"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Send message",
						disabled: !canSend,
						onClick: send,
						className: "inline-flex size-11 items-center justify-center rounded-md bg-accent text-accent-ink hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 lg:size-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})
				]
			})
		]
	});
}
var ToolbarButton = (0, import_react.forwardRef)(function ToolbarButton({ label, children, className, ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type: "button",
		...props,
		"aria-label": label,
		className: cn("inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:size-8", className),
		children
	});
});
var HANDLES = new Set(USERS.map((user) => user.handle));
function renderInline(text, depth = 0) {
	const pattern = depth === 0 ? /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`\n]+)`|\*\*((?:(?!\*\*).)+?)\*\*|\*([^*\n]+)\*|(https?:\/\/[^\s<]+)|\B@([a-z0-9-]+)/g : /`([^`\n]+)`|\*([^*\n]+)\*|(https?:\/\/[^\s<]+)/g;
	const nodes = [];
	let last = 0;
	let match;
	let key = 0;
	while (match = pattern.exec(text)) {
		if (match.index > last) nodes.push(text.slice(last, match.index));
		if (depth === 0 && match[1] && match[2]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: match[2],
			target: "_blank",
			rel: "noreferrer",
			className: "font-medium text-accent underline",
			children: match[1]
		}, key++));
		else if (depth === 0 && match[3]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code$1, { children: match[3] }, key++));
		else if (depth === 0 && match[4]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold",
			children: renderInline(match[4], 1)
		}, key++));
		else if (depth === 0 && match[5]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
			className: "italic",
			children: match[5]
		}, key++));
		else if (depth === 0 && match[6]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			href: match[6],
			label: match[6]
		}, key++));
		else if (depth === 0 && match[7] && HANDLES.has(match[7].toLowerCase())) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-sm bg-accent/10 px-1 font-semibold text-accent",
			children: ["@", match[7]]
		}, key++));
		else if (depth > 0 && match[1]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code$1, { children: match[1] }, key++));
		else if (depth > 0 && match[2]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
			className: "italic",
			children: match[2]
		}, key++));
		else if (depth > 0 && match[3]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			href: match[3],
			label: match[3]
		}, key++));
		else nodes.push(match[0]);
		last = match.index + match[0].length;
	}
	if (last < text.length) nodes.push(text.slice(last));
	return nodes;
}
function Code$1({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
		className: "rounded-sm bg-line px-1 py-0.5 font-mono text-xs",
		children
	});
}
function Link({ href, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		target: "_blank",
		rel: "noreferrer",
		className: "font-medium text-accent underline",
		children: label
	});
}
function MessageBody({ text }) {
	if (!text.trim()) return null;
	const lines = text.split("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "wrap-anywhere text-sm leading-normal text-pretty",
		children: lines.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [index > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}) : null, line.length > 0 ? renderInline(line) : null] }, index))
	});
}
function MessageList({ conversationId, messages, emptyTitle, emptyBody, mode = "channel" }) {
	const highlightId = useOrbit((state) => state.highlightId);
	const scroller = (0, import_react.useRef)(null);
	const nearBottom = (0, import_react.useRef)(true);
	const previous = (0, import_react.useRef)({
		id: "",
		length: 0
	});
	const [pending, setPending] = (0, import_react.useState)(0);
	const roots = mode === "thread" ? messages : messages.filter((message) => message.conversationId === conversationId && !message.parentId);
	const days = bucketByDay(roots);
	const coarse = useCoarsePointer();
	function scrollTarget() {
		const node = scroller.current;
		if (!node) return null;
		if (mode === "thread") return node.closest("[data-thread-scroll]");
		return node;
	}
	(0, import_react.useLayoutEffect)(() => {
		const el = scrollTarget();
		const switched = previous.current.id !== conversationId;
		const grew = roots.length - previous.current.length;
		previous.current = {
			id: conversationId,
			length: roots.length
		};
		if (!el) return;
		if (highlightId) {
			const target = document.getElementById(`msg-${highlightId}`);
			if (target && el.contains(target)) {
				target.scrollIntoView({ block: "center" });
				return;
			}
		}
		if (mode === "thread" || switched || nearBottom.current) {
			el.scrollTop = el.scrollHeight;
			nearBottom.current = true;
			setPending(0);
			return;
		}
		if (grew > 0) setPending((count) => count + grew);
	}, [
		conversationId,
		roots.length,
		highlightId,
		mode
	]);
	if (roots.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-1 items-center justify-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-sm text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold text-balance",
				children: emptyTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-normal text-ink-soft",
				children: emptyBody
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: scroller,
		onScroll: () => {
			const el = scroller.current;
			if (!el || mode === "thread") return;
			const near = el.scrollHeight - el.scrollTop - el.clientHeight <= el.clientHeight;
			nearBottom.current = near;
			if (near) setPending(0);
		},
		className: mode === "thread" ? "w-full" : "flex min-h-0 flex-1 flex-col overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-auto flex w-full max-w-3xl flex-col py-3",
			children: [
				days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-label": day.label,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "sticky top-0 z-10 mx-4 my-2 bg-paper/95 py-1 text-center text-xs font-semibold tracking-wide text-ink-faint",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-line bg-paper-raised px-3 py-1",
							children: day.label
						})
					}), groupMessages(day.messages).map((group) => group.messages[0]?.system ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: group.messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "px-6 py-2 text-center text-xs text-ink-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
								className: "mr-1 inline size-3.5 align-text-bottom",
								"aria-hidden": "true"
							}),
							message.body,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "sr-only",
								children: [", ", absoluteTime(message.createdAt)]
							})
						]
					}, message.id)) }, group.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageGroupView, {
						group,
						allMessages: messages,
						inThread: mode === "thread",
						coarse
					}, group.id))]
				}, day.key)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
				mode === "channel" && pending > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky bottom-3 z-20 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const el = scroller.current;
							if (!el) return;
							el.scrollTop = el.scrollHeight;
							nearBottom.current = true;
							setPending(0);
						},
						className: "rounded-full bg-accent px-3 py-2 text-xs font-semibold text-accent-ink shadow-pop focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
						children: "New messages"
					})
				}) : null
			]
		})
	});
}
function MessageGroupView({ group, allMessages, inThread, coarse }) {
	const alwaysShowTime = useOrbit((state) => state.alwaysShowTime);
	const presence = useOrbit((state) => state.presence);
	const author = userById(group.authorId);
	const yours = group.authorId === YOU;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative px-2 py-0.5", yours && "bg-accent/5"),
		children: [yours ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-1 bottom-1 left-0 w-1 rounded-full bg-accent",
			"aria-hidden": "true"
		}) : null, group.messages.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageRow, {
			message,
			grouped: index > 0,
			showTime: index === 0 || alwaysShowTime,
			authorName: author.name,
			yours,
			presence,
			replies: inThread ? 0 : replyCount(allMessages, message.id),
			inThread,
			coarse
		}, message.id))]
	});
}
function MessageRow({ message, grouped, showTime, authorName, yours, presence, replies, inThread, coarse }) {
	const highlightId = useOrbit((state) => state.highlightId);
	const saved = useOrbit((state) => state.savedIds.includes(message.id));
	const [menu, setMenu] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(message.body);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [linkCopy, setLinkCopy] = (0, import_react.useState)(null);
	const [picking, setPicking] = (0, import_react.useState)(false);
	const [dock, setDock] = (0, import_react.useState)("top");
	const [engaged, setEngaged] = (0, import_react.useState)(false);
	const articleRef = (0, import_react.useRef)(null);
	const fullTime = absoluteTime(message.createdAt);
	function placeToolbar() {
		const top = articleRef.current?.getBoundingClientRect().top ?? 0;
		setDock(top < 96 ? "bottom" : "top");
	}
	function release(event) {
		const next = event.relatedTarget;
		if (next instanceof Node && articleRef.current?.contains(next)) return;
		if (next instanceof Element && next.closest("[role='menu'], [data-radix-popper-content-wrapper]")) return;
		setEngaged(false);
	}
	const actionable = coarse || engaged || menu !== null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		ref: articleRef,
		id: `msg-${message.id}`,
		onMouseEnter: placeToolbar,
		onFocus: () => {
			setEngaged(true);
			placeToolbar();
		},
		onBlur: release,
		tabIndex: coarse ? void 0 : 0,
		className: cn("group relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2 rounded-md px-2 py-1 hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", highlightId === message.id && "bg-accent/10", menu && "bg-ink/5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative pt-0.5",
				children: grouped ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("time", {
					dateTime: message.createdAt,
					title: fullTime,
					className: cn("absolute top-1 right-0 left-0 text-center text-xs text-ink-faint tabular-nums", showTime ? "block" : "hidden group-hover:block group-focus-within:block"),
					children: [gutterTime(message.createdAt), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "sr-only",
						children: [", ", fullTime]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					userId: message.authorId,
					selfPresence: presence,
					showPresence: false
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					grouped ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-wrap items-baseline gap-x-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold",
								children: authorName
							}),
							yours ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-ink-faint",
								children: "You"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("time", {
								dateTime: message.createdAt,
								title: fullTime,
								className: "text-xs text-ink-faint tabular-nums",
								children: [timeLabel(message.createdAt), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sr-only",
									children: [", ", fullTime]
								})]
							}),
							message.editedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-ink-faint",
								children: "(edited)"
							}) : null,
							message.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-ink-soft",
								children: "Pinned"
							}) : null
						]
					}),
					editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-1",
						onSubmit: (event) => {
							event.preventDefault();
							useOrbit.getState().editMessage(message.id, draft);
							setEditing(false);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "sr-only",
								htmlFor: `edit-${message.id}`,
								children: "Edit message"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: `edit-${message.id}`,
								value: draft,
								onChange: (event) => setDraft(event.target.value),
								onKeyDown: (event) => {
									if (event.key === "Escape") {
										event.preventDefault();
										setEditing(false);
										setDraft(message.body);
									}
									if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
										event.preventDefault();
										event.currentTarget.form?.requestSubmit();
									}
								},
								className: "min-h-16 w-full rounded-md border border-line bg-paper-raised px-2 py-2 text-sm outline-none focus-visible:border-accent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: !draft.trim(),
									className: "rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink disabled:opacity-40",
									children: "Save"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-md px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-line",
									onClick: () => {
										setEditing(false);
										setDraft(message.body);
									},
									children: "Cancel"
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBody, { text: message.body }),
					grouped && message.editedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-ink-faint",
						children: "(edited)"
					}) : null,
					message.attachments?.map((file) => {
						const href = fileUrl(file.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 inline-flex max-w-full items-center gap-2 rounded-md border border-line bg-paper-raised px-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate font-medium",
									children: file.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-ink-faint tabular-nums",
									children: formatBytes(file.size)
								}),
								href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href,
									download: file.name,
									className: "text-xs font-semibold text-accent underline",
									children: "Open"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-ink-soft",
									children: "This file is no longer available locally."
								})
							]
						}, file.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactionRow, { message }),
					replies > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => useOrbit.getState().openThread(message.id),
						className: "mt-1 inline-flex items-center gap-1 rounded-md px-1 py-1 text-xs font-semibold text-accent hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
								className: "size-3.5",
								"aria-hidden": "true"
							}),
							replies,
							" ",
							replies === 1 ? "reply" : "replies"
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("absolute right-2 z-20 flex items-center gap-0.5 rounded-md border border-line bg-paper-raised p-0.5 shadow-pop", dock === "bottom" ? "top-full mt-1" : "top-0 -translate-y-1/2", menu ? "pointer-events-auto opacity-100" : !coarse && "pointer-events-none opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2$1, {
						open: menu === "react",
						onOpenChange: (open) => setMenu(open ? "react" : null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								label: "React",
								tabIndex: actionable ? 0 : -1,
								className: coarse ? "hidden" : void 0,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
							side: dock === "bottom" ? "bottom" : "top",
							align: "end",
							className: "orbit-pop z-50 grid grid-cols-8 gap-1 rounded-lg border border-line bg-paper-raised p-2 shadow-pop",
							children: REACTIONS.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `React with ${emoji}`,
								className: "inline-flex size-8 items-center justify-center rounded-md hover:bg-line focus-visible:outline-2 focus-visible:outline-accent",
								onClick: () => {
									useOrbit.getState().toggleReaction(message.id, emoji);
									setMenu(null);
								},
								children: emoji
							}, emoji))
						}) })]
					}),
					inThread ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
						label: "Reply in thread",
						tabIndex: actionable ? 0 : -1,
						className: coarse ? "hidden" : void 0,
						onClick: () => useOrbit.getState().openThread(message.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
						label: saved ? "Remove from Later" : "Save for later",
						pressed: saved,
						tabIndex: actionable ? 0 : -1,
						className: coarse ? "hidden" : void 0,
						onClick: () => useOrbit.getState().toggleSaved(message.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: cn("size-4", saved && "fill-current") })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, {
						open: menu === "more",
						onOpenChange: (open) => {
							setMenu(open ? "more" : null);
							if (!open) {
								setConfirmDelete(false);
								setPicking(false);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								label: "More actions",
								tabIndex: actionable ? 0 : -1,
								className: coarse ? "size-11" : void 0,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
							align: "end",
							className: "orbit-pop z-50 min-w-44 rounded-lg border border-line bg-paper-raised p-1 text-sm shadow-pop",
							children: picking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-8 gap-1 p-1",
								children: REACTIONS.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `React with ${emoji}`,
									className: "inline-flex size-8 items-center justify-center rounded-md hover:bg-line focus-visible:outline-2 focus-visible:outline-accent",
									onClick: () => {
										useOrbit.getState().toggleReaction(message.id, emoji);
										setMenu(null);
										setPicking(false);
									},
									children: emoji
								}, emoji))
							}) : confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-2 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Delete this message?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										autoFocus: true,
										className: "rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
										onClick: () => {
											useOrbit.getState().deleteMessage(message.id);
											setMenu(null);
											toast("Message deleted", { action: {
												label: "Undo",
												onClick: () => useOrbit.getState().undoDelete(message.id)
											} });
										},
										children: "Delete"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "rounded-md px-2 py-1 text-xs font-medium text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
										onClick: () => setConfirmDelete(false),
										children: "Cancel"
									})]
								})]
							}) : linkCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block px-2 py-2 text-xs",
								children: ["Copy this link", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									readOnly: true,
									value: linkCopy,
									className: "mt-1 w-full rounded-md border border-line bg-paper px-2 py-2 text-sm",
									onFocus: (event) => event.currentTarget.select()
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								coarse ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuItem, {
									onSelect: (event) => {
										event.preventDefault();
										setPicking(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Add reaction"]
								}) : null,
								coarse && !inThread ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuItem, {
									onSelect: () => useOrbit.getState().openThread(message.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Reply in thread"]
								}) : null,
								coarse ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuItem, {
									onSelect: () => useOrbit.getState().toggleSaved(message.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
										className: "size-4",
										"aria-hidden": "true"
									}), saved ? "Remove from Later" : "Save for later"]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuItem, {
									onSelect: (event) => {
										event.preventDefault();
										copyMessageLink(message).then((fallback) => {
											if (fallback) setLinkCopy(fallback);
											else setMenu(null);
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Copy link"]
								}),
								yours ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuItem, {
									onSelect: () => {
										setDraft(message.body);
										setEditing(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Edit"]
								}) : null,
								yours ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuItem, {
									onSelect: (event) => {
										event.preventDefault();
										setConfirmDelete(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Delete"]
								}) : null
							] })
						}) })]
					})
				]
			})
		]
	});
}
function ReactionRow({ message }) {
	if (message.reactions.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 flex max-w-full flex-wrap gap-1",
		children: message.reactions.map((reaction) => {
			const mine = reaction.userIds.includes(YOU);
			const names = reaction.userIds.map((id) => id === "u_me" ? "You" : userById(id).name).join(", ");
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-pressed": mine,
				"aria-label": `${reaction.emoji}, ${reaction.userIds.length}. ${names}. ${mine ? "Remove your reaction" : "Add your reaction"}`,
				onClick: () => useOrbit.getState().toggleReaction(message.id, reaction.emoji),
				className: cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", mine ? "border-accent bg-accent/10 font-semibold" : "border-line bg-paper-raised"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: reaction.emoji
				}), reaction.userIds.length]
			}, reaction.emoji);
		})
	});
}
async function copyMessageLink(message) {
	const url = `${location.origin}${location.pathname}#${message.conversationId}/${message.id}`;
	try {
		await navigator.clipboard.writeText(url);
		toast("Link copied");
		return null;
	} catch {
		return url;
	}
}
var ActionButton = (0, import_react.forwardRef)(function ActionButton({ label, pressed, className, onClick, children, ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type: "button",
		...props,
		"aria-label": label,
		"aria-pressed": pressed,
		onClick,
		className: cn("inline-flex size-8 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", className),
		children
	});
});
function MenuItem({ children, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		onSelect,
		className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line",
		children
	});
}
function useCoarsePointer() {
	const [coarse, setCoarse] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const query = window.matchMedia("(hover: none)");
		const apply = () => setCoarse(query.matches);
		apply();
		query.addEventListener("change", apply);
		return () => query.removeEventListener("change", apply);
	}, []);
	return coarse;
}
function ConversationPane({ messages }) {
	const conversationId = useOrbit((state) => state.conversationId);
	const extra = useOrbit((state) => state.extraConversations);
	const presence = useOrbit((state) => state.presence);
	const conversation = conversationById(conversationsOf(extra), conversationId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "conversation",
		"aria-label": "Conversation",
		tabIndex: -1,
		className: "relative flex min-h-0 min-w-0 flex-1 flex-col bg-paper outline-none",
		children: [conversation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: "#composer",
			className: "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-16 focus:z-30 focus:rounded-md focus:bg-paper-raised focus:px-3 focus:py-2 focus:shadow-pop",
			children: "Skip to composer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationHeader, {
			conversation,
			messages,
			presence
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-base font-semibold",
				children: "Direct messages"
			})]
		}), conversation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinnedBanner, {
				messages,
				conversationId: conversation.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageList, {
				conversationId: conversation.id,
				messages,
				emptyTitle: conversation.kind === "channel" ? `This is the start of #${conversation.name}` : `This is the start of your conversation`,
				emptyBody: conversation.kind === "channel" ? conversation.description : "Say hello. Messages stay on this device."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 px-4 pt-2 pb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
					draftKey: conversation.id,
					fieldId: "composer",
					conversationId: conversation.id,
					placeholder: conversation.kind === "channel" ? `Message #${conversation.name}` : `Message ${conversation.participantIds.filter((id) => id !== "u_me").length === 1 ? userById(conversation.participantIds.find((id) => id !== "u_me") ?? "").name.split(" ")[0] : conversationTitle(conversation)}`
				})
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-1 items-center justify-center px-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "No direct messages yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink-soft",
					children: "This workspace only has channels. Switch back to Orbit for the launch conversations."
				})]
			})
		})]
	});
}
function condensedNames(ids) {
	const names = ids.map((id) => userById(id).name.split(" ")[0] ?? "");
	if (names.length <= 2) return names.join(" and ");
	return `${names.slice(0, 2).join(", ")}, +${names.length - 2} more`;
}
function MenuButton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Open navigation",
		onClick: () => useOrbit.getState().setNavOpen(true),
		className: "inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
	});
}
function ConversationHeader({ conversation, messages, presence }) {
	const title = conversationTitle(conversation);
	const members = memberIds(conversation);
	const others = members.filter((id) => id !== YOU);
	const subtitle = conversation.kind === "channel" ? conversation.description : others.length === 1 ? `${userById(others[0] ?? "").title} · ${presenceLabel(presenceOf(others[0] ?? "", presence))}` : condensedNames(others);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 lg:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 items-center gap-2",
				children: [conversation.kind === "channel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
					className: "size-4 shrink-0 text-ink-soft",
					"aria-hidden": "true"
				}) : others.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex shrink-0 -space-x-2",
					children: others.slice(0, 3).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						userId: id,
						selfPresence: presence,
						size: "sm"
					}, id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					userId: others[0] ?? "u_me",
					selfPresence: presence,
					size: "sm",
					showPresence: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						id: "conversation-title",
						title,
						className: "truncate text-base font-semibold",
						children: conversation.kind === "channel" ? title : title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						title: subtitle,
						className: "truncate text-xs text-ink-faint",
						children: subtitle
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailsButton, {
				conversation,
				messages,
				presence,
				count: members.length
			}),
			conversation.kind === "dm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallButtons, {
				conversation,
				title
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `Search ${conversation.kind === "channel" ? `#${conversation.name}` : title}`,
				onClick: () => useOrbit.getState().openSearch(conversation.id),
				className: "inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:size-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
			})
		]
	});
}
function CallButtons({ conversation, title }) {
	if (conversation.kind !== "dm") return null;
	const disabled = memberIds(conversation).length > 8;
	const reason = disabled ? "Calls are limited to 8 people in this demo." : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": `Voice call with ${title}`,
		title: reason,
		disabled,
		onClick: () => useOrbit.getState().requestCall(conversation.id, "voice"),
		className: "inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {
			className: "size-4",
			"aria-hidden": "true"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": `Video call with ${title}`,
		title: reason,
		disabled,
		onClick: () => useOrbit.getState().requestCall(conversation.id, "video"),
		className: "inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, {
			className: "size-4",
			"aria-hidden": "true"
		})
	})] });
}
function PinnedBanner({ messages, conversationId }) {
	const pinned = messages.find((message) => message.conversationId === conversationId && message.pinned && !message.parentId);
	if (!pinned) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => useOrbit.getState().highlight(pinned.id),
		className: "flex items-center gap-2 border-b border-line px-4 py-2 text-left text-sm hover:bg-ink/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
			className: "size-4 shrink-0 text-ink-soft",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: pinned.body
		})]
	});
}
function DetailsButton({ conversation, messages, presence, count }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const pinned = messages.find((message) => message.conversationId === conversation.id && message.pinned);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2$1, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-label": `Details, ${count} members`,
				className: "inline-flex h-11 items-center gap-1 rounded-md px-2 text-xs font-medium text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:h-9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
						className: "size-4",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: count
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2$1, {
			align: "end",
			className: "orbit-pop z-40 w-80 rounded-lg border border-line bg-paper-raised p-4 text-sm shadow-pop",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-ink-soft",
					children: conversation.kind === "channel" ? conversation.description : peopleLabel(memberIds(conversation))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs font-semibold tracking-wide text-ink-faint uppercase",
					children: [count, " members"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 max-h-56 space-y-2 overflow-y-auto",
					children: memberIds(conversation).map((id) => {
						const user = userById(id);
						const state = presenceOf(id, presence);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								userId: id,
								selfPresence: presence,
								size: "sm",
								showPresence: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-medium",
									children: user.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-xs text-ink-faint",
									children: [
										user.title,
										" · ",
										presenceLabel(state)
									]
								})]
							})]
						}, id);
					})
				}),
				pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mt-3 w-full rounded-md border border-line px-3 py-2 text-left hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
					onClick: () => {
						useOrbit.getState().highlight(pinned.id);
						setOpen(false);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-ink-faint",
						children: "Pinned"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block truncate",
						children: pinned.body
					})]
				}) : null
			]
		}) })]
	});
}
function OrbitDialogs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelDialog, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDialog, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrefsDialog, {})
	] });
}
function ChannelDialog() {
	const open = useOrbit((state) => state.channelDialog);
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		open,
		onOpenChange: (next) => {
			useOrbit.getState().setChannelDialog(next);
			if (!next) {
				setName("");
				setDescription("");
				setError(null);
			}
		},
		title: "Create a channel",
		description: "Channels are visible to everyone in this workspace.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 flex flex-col gap-3",
			onSubmit: (event) => {
				event.preventDefault();
				const result = useOrbit.getState().createChannel(name, description);
				setError(result);
				if (!result) {
					setName("");
					setDescription("");
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "channel-name",
					label: "Channel name",
					value: name,
					onChange: setName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "channel-description",
					label: "Description",
					value: description,
					onChange: setDescription
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Submit, { label: "Create channel" })
			]
		})
	});
}
function StatusDialog() {
	const open = useOrbit((state) => state.statusDialog);
	const status = useOrbit((state) => state.status);
	const [value, setValue] = (0, import_react.useState)(status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		open,
		onOpenChange: (next) => {
			if (next) setValue(useOrbit.getState().status);
			useOrbit.getState().setStatusDialog(next);
		},
		title: "Set a status",
		description: "Teammates on this device will see it under your name.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 flex flex-col gap-3",
			onSubmit: (event) => {
				event.preventDefault();
				useOrbit.getState().setStatus(value);
				useOrbit.getState().setStatusDialog(false);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: "status-text",
				label: "Status",
				value,
				onChange: setValue
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Submit, { label: "Save status" })]
		})
	});
}
function PrefsDialog() {
	const open = useOrbit((state) => state.prefsDialog);
	const always = useOrbit((state) => state.alwaysShowTime);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		open,
		onOpenChange: useOrbit.getState().setPrefsDialog,
		title: "Preferences",
		description: "Saved with your messages on this device.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-4 flex items-center justify-between gap-4 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Always show message times" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: always,
				onChange: (event) => useOrbit.getState().setAlwaysShowTime(event.target.checked),
				className: "size-4 accent-accent"
			})]
		})
	});
}
function Shell({ open, onOpenChange, title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "orbit-pop fixed inset-x-4 top-24 z-50 mx-auto w-full max-w-md rounded-xl border border-line bg-paper-raised p-5 text-ink shadow-pop outline-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-lg font-semibold text-balance",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-ink-soft",
					children: description
				}),
				children,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					className: "mt-4 text-sm font-medium text-ink-soft underline",
					children: "Close"
				})
			]
		})] })
	});
}
function Field({ id, label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor: id,
		className: "text-sm font-medium",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			value,
			onChange: (event) => onChange(event.target.value),
			className: "mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 font-normal outline-none focus-visible:border-accent"
		})]
	});
}
function Submit({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "submit",
		className: "rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
		children: label
	});
}
function ActivityView({ messages }) {
	const extra = useOrbit((state) => state.extraConversations);
	const workspaceId = useOrbit((state) => state.workspaceId);
	const activityReadIds = useOrbit((state) => state.activityReadIds);
	const deletedIds = useOrbit((state) => state.deletedIds);
	const conversations = conversationsOf(extra).filter((item) => item.workspaceId === workspaceId);
	const items = activityItems(messages).filter((item) => conversations.some((conversation) => conversation.id === item.conversationId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Activity",
		className: "flex min-h-0 min-w-0 flex-1 flex-col bg-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaneHeader, {
			title: "Activity",
			detail: "Mentions and threads you’re in",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "ml-auto inline-flex h-11 items-center rounded-md px-3 text-sm font-semibold text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
				onClick: () => useOrbit.getState().markActivityRead(),
				children: "Mark all read"
			})
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "You’re caught up",
			body: "Mentions and replies in your threads will show up here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "min-h-0 flex-1 overflow-y-auto",
			children: items.map((item) => {
				const conversation = conversationById(conversations, item.conversationId);
				const where = conversation ? conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation) : "a conversation";
				const gone = deletedIds.includes(item.message.id);
				const unread = !activityReadIds.includes(item.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: gone,
					onClick: () => useOrbit.getState().openActivity(item.message.id),
					className: "flex w-full gap-3 border-b border-line px-4 py-3 text-left hover:bg-ink/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent disabled:hover:bg-transparent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						userId: item.message.authorId,
						size: "sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-baseline gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold",
										children: userById(item.message.authorId).name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-ink-faint",
										children: item.kind === "mention" ? "mentioned you" : "replied in a thread"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs text-ink-faint tabular-nums",
										children: timeLabel(item.message.createdAt)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-ink-soft",
								children: where
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block truncate text-sm",
								title: gone ? "Message unavailable" : item.message.body,
								children: [gone ? "Message unavailable" : snippet(item.message.body), unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: ", unread"
								}) : null]
							})
						]
					})]
				}) }, item.id);
			})
		})]
	});
}
function LaterView({ messages }) {
	const savedIds = useOrbit((state) => state.savedIds);
	const savedAt = useOrbit((state) => state.savedAt);
	const deletedIds = useOrbit((state) => state.deletedIds);
	const created = useOrbit((state) => state.createdMessages);
	const edited = useOrbit((state) => state.edited);
	const conversations = conversationsOf(useOrbit((state) => state.extraConversations));
	const saved = savedIds.map((id) => {
		const live = messages.find((message) => message.id === id);
		return {
			id,
			message: live ?? created.find((message) => message.id === id) ?? SEED_MESSAGES.find((message) => message.id === id),
			deleted: deletedIds.includes(id) || !live
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Later",
		className: "flex min-h-0 min-w-0 flex-1 flex-col bg-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaneHeader, {
			title: "Later",
			detail: "Messages you saved on this device"
		}), saved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "Nothing saved",
			body: "Open a message and choose Save for later. It will wait here.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
				onClick: () => useOrbit.getState().openConversation(useOrbit.getState().conversationId || "general"),
				children: "Back to conversation"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "min-h-0 flex-1 overflow-y-auto",
			children: saved.map(({ id, message, deleted }) => {
				const conversation = message ? conversationById(conversations, message.conversationId) : void 0;
				const where = conversation ? conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation) : "Conversation";
				const body = message ? edited[id]?.body ?? message.body : "";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2 border-b border-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-label": "Open",
						disabled: deleted || !message,
						onClick: () => message && useOrbit.getState().focusMessage(message.id),
						className: "flex min-w-0 flex-1 gap-3 px-4 py-3 text-left hover:bg-ink/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent disabled:hover:bg-transparent",
						children: [message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							userId: message.authorId,
							size: "sm"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: message ? userById(message.authorId).name : "Saved message"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-ink-faint",
									children: where
								}),
								savedAt[id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-xs text-ink-faint",
									children: ["Saved ", timeLabel(savedAt[id])]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block truncate text-sm",
									title: deleted ? "This message was deleted" : body,
									children: deleted ? "This message was deleted" : snippet(body)
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mr-3 mt-3 shrink-0 rounded-md px-2 py-2 text-xs font-semibold text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
						"aria-label": "Remove",
						onClick: () => useOrbit.getState().toggleSaved(id),
						children: "Remove"
					})]
				}, id);
			})
		})]
	});
}
function PaneHeader({ title, detail, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 lg:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Open navigation",
				onClick: () => useOrbit.getState().setNavOpen(true),
				className: "inline-flex size-11 items-center justify-center rounded-md md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-base font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-ink-faint",
					children: detail
				})]
			}),
			children
		]
	});
}
function Empty({ title, body, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-1 items-center justify-center px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-balance",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-normal text-ink-soft",
					children: body
				}),
				children
			]
		})
	});
}
var LIMIT = 5;
function SearchDialog({ messages }) {
	const open = useOrbit((state) => state.searchOpen);
	const scopeId = useOrbit((state) => state.searchScopeId);
	const recentIds = useOrbit((state) => state.recentIds);
	const conversationId = useOrbit((state) => state.conversationId);
	const conversations = conversationsOf(useOrbit((state) => state.extraConversations)).filter((item) => item.workspaceId === "orbit");
	const scope = conversations.find((item) => item.id === scopeId) ?? null;
	const [query, setQuery] = (0, import_react.useState)("");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const [more, setMore] = (0, import_react.useState)({
		channels: false,
		people: false,
		messages: false
	});
	(0, import_react.useEffect)(() => {
		if (!open) {
			setQuery("");
			setDebounced("");
		}
	}, [open]);
	(0, import_react.useEffect)(() => {
		const timer = window.setTimeout(() => setDebounced(query), 200);
		return () => window.clearTimeout(timer);
	}, [query]);
	(0, import_react.useEffect)(() => {
		setMore({
			channels: false,
			people: false,
			messages: false
		});
	}, [query, scopeId]);
	const q = debounced.trim().toLowerCase();
	const channels = conversations.filter((item) => item.kind === "channel");
	const people = peopleIn(conversations);
	const channelHits = (q ? channels.filter((item) => includes(item.name, q) || includes(item.description, q)) : []).sort((a, b) => rankText(`${a.name} ${a.description}`, q) - rankText(`${b.name} ${b.description}`, q));
	const peopleHits = (q ? people.filter((person) => includes(person.name, q) || includes(person.handle, q) || includes(person.title, q)) : []).sort((a, b) => rankText(a.name, q) - rankText(b.name, q));
	const messageHits = (q ? messages.filter((message) => {
		if (scope && message.conversationId !== scope.id) return false;
		if (!conversations.some((item) => item.id === message.conversationId)) return false;
		const where = whereLabel(conversations, message.conversationId);
		return includes(message.body, q) || includes(userById(message.authorId).name, q) || includes(where, q);
	}) : []).sort((a, b) => rankText(a.body, q) - rankText(b.body, q) || b.createdAt.localeCompare(a.createdAt));
	const recent = recentConversations(conversations, recentIds, conversationId);
	const nothing = Boolean(q) && channelHits.length + peopleHits.length + messageHits.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Dialog, {
		open,
		onOpenChange: useOrbit.getState().setSearchOpen,
		label: "Search Orbit",
		shouldFilter: false,
		vimBindings: false,
		overlayClassName: "fixed inset-0 z-40 bg-ink/40",
		contentClassName: "orbit-search orbit-pop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center border-b border-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
					value: query,
					onValueChange: setQuery,
					placeholder: scope ? `Search ${scopeName(scope)}` : "Search Orbit",
					className: "min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink-faint"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mr-2 inline-flex h-11 items-center rounded-md px-3 text-sm font-medium text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden",
					onClick: () => useOrbit.getState().setSearchOpen(false),
					children: "Close"
				})]
			}),
			scope ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-line px-4 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-line px-2 py-1 text-xs font-medium",
					children: ["In ", scopeName(scope)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
					onClick: () => useOrbit.getState().openSearch(null),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "size-3.5",
						"aria-hidden": "true"
					}), "Search all of Orbit"]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
				className: "p-2",
				children: [
					nothing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 py-8 text-center text-sm text-ink-soft",
						children: [
							"No results for “",
							query.trim(),
							"”"
						]
					}) : null,
					!q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
						heading: "Recent",
						children: recent.map((conversation) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationResult, { conversation }, conversation.id))
					}) : null,
					q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultGroup, {
						heading: "Channels",
						items: channelHits,
						expanded: more.channels,
						onMore: () => setMore((state) => ({
							...state,
							channels: true
						})),
						render: (conversation) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationResult, { conversation }, conversation.id)
					}) : null,
					q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultGroup, {
						heading: "People",
						items: peopleHits,
						expanded: more.people,
						onMore: () => setMore((state) => ({
							...state,
							people: true
						})),
						render: (person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
							value: `person ${person.id}`,
							onSelect: () => {
								const dm = dmFor(conversations, person.id);
								if (dm) useOrbit.getState().openConversation(dm.id);
								useOrbit.getState().setSearchOpen(false);
							},
							className: "mt-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-ink data-[selected=true]:bg-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
									className: "size-4 text-ink-faint",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: person.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-ink-faint",
									children: person.title
								})
							]
						}, person.id)
					}) : null,
					q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultGroup, {
						heading: "Messages",
						items: messageHits,
						expanded: more.messages,
						onMore: () => setMore((state) => ({
							...state,
							messages: true
						})),
						render: (message) => {
							const where = whereLabel(conversations, message.conversationId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
								value: `message ${message.id}`,
								onSelect: () => {
									useOrbit.getState().focusMessage(message.id);
									useOrbit.getState().setSearchOpen(false);
								},
								className: "mt-1 flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-sm text-ink data-[selected=true]:bg-line",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
									className: "mt-0.5 size-4 shrink-0 text-ink-faint",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block truncate font-medium",
										children: [
											userById(message.authorId).name,
											" · ",
											where
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-ink-soft",
										children: snippet(message.body)
									})]
								})]
							}, message.id);
						}
					}) : null
				]
			})
		]
	});
}
function ResultGroup({ heading, items, expanded, onMore, render }) {
	if (items.length === 0) return null;
	const shown = expanded ? items : items.slice(0, LIMIT);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
		heading,
		className: "mt-2",
		children: [shown.map((item) => render(item)), !expanded && items.length > LIMIT ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "mt-1 w-full rounded-md px-2 py-2 text-left text-xs font-semibold text-accent hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
			onClick: onMore,
			children: [
				"Show ",
				items.length - LIMIT,
				" more"
			]
		}) : null]
	});
}
function ConversationResult({ conversation }) {
	const label = conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
		value: `conversation ${conversation.id}`,
		onSelect: () => {
			useOrbit.getState().openConversation(conversation.id);
			useOrbit.getState().setSearchOpen(false);
		},
		className: "mt-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-ink data-[selected=true]:bg-line",
		children: [conversation.kind === "channel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
			className: "size-4 text-ink-faint",
			"aria-hidden": "true"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
			className: "size-4 text-ink-faint",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: label
		})]
	});
}
function rankText(text, query) {
	const value = text.toLowerCase();
	if (!query) return 3;
	if (value === query) return 0;
	if (value.startsWith(query)) return 1;
	if (value.includes(query)) return 2;
	return 3;
}
function includes(value, query) {
	return value.toLowerCase().includes(query);
}
function scopeName(conversation) {
	return conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation);
}
function whereLabel(conversations, id) {
	const conversation = conversations.find((item) => item.id === id);
	if (!conversation) return "Message";
	return conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation);
}
function peopleIn(conversations) {
	const ids = /* @__PURE__ */ new Set();
	for (const conversation of conversations) {
		const members = conversation.kind === "channel" ? conversation.memberIds : conversation.participantIds;
		for (const id of members) ids.add(id);
	}
	return [...ids].filter((id) => id !== YOU).map((id) => userById(id));
}
function dmFor(conversations, userId) {
	return conversations.find((conversation) => conversation.kind === "dm" && !conversation.title && conversation.participantIds.includes(userId)) ?? conversations.find((conversation) => conversation.kind === "dm" && conversation.participantIds.includes(userId));
}
function recentConversations(conversations, recentIds, currentId) {
	const ids = recentIds.length > 0 ? recentIds : [
		currentId,
		"general",
		"product",
		"design"
	];
	return [...new Set(ids)].map((id) => conversations.find((item) => item.id === id)).filter((item) => Boolean(item)).slice(0, LIMIT);
}
function ThreadPane({ messages }) {
	const parentId = useOrbit((state) => state.threadParentId);
	const extra = useOrbit((state) => state.extraConversations);
	const presence = useOrbit((state) => state.presence);
	const close = useOrbit((state) => state.closeThread);
	const parent = messages.find((message) => message.id === parentId);
	const replies = messages.filter((message) => message.parentId === parentId);
	const conversation = parent ? conversationById(conversationsOf(extra), parent.conversationId) : null;
	const heading = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!parentId) return;
		heading.current?.focus({ preventScroll: true });
		function onKey(event) {
			if (event.key !== "Escape" || event.defaultPrevented) return;
			if (useOrbit.getState().searchOpen) return;
			close();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [parentId, close]);
	if (!parentId) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"aria-labelledby": "thread-heading",
		onKeyDown: (event) => {
			if (event.key === "Escape") {
				event.stopPropagation();
				close();
			}
		},
		className: "absolute inset-0 z-30 flex w-full min-h-0 flex-col bg-paper shadow-pop md:inset-y-0 md:right-0 md:left-auto md:w-thread xl:static xl:z-auto xl:w-thread xl:shrink-0 xl:border-l xl:shadow-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "thread-heading",
						ref: heading,
						tabIndex: -1,
						className: "text-base font-semibold outline-none",
						children: "Thread"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-ink-faint",
						children: conversation ? conversation.kind === "channel" ? `#${conversationTitle(conversation)}` : conversationTitle(conversation) : "Conversation"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-label": "Back to conversation",
					onClick: close,
					className: "inline-flex h-11 shrink-0 items-center gap-1 rounded-md px-2 text-sm font-medium text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "md:sr-only",
						children: "Back"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-thread-scroll": true,
				className: "min-h-0 flex-1 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-line px-4 py-4",
					children: parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: cn("relative rounded-md px-2 py-1", parent.authorId === "u_me" && "bg-accent/5"),
						children: [
							parent.authorId === "u_me" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-1 bottom-1 left-0 w-1 rounded-full bg-accent",
								"aria-hidden": "true"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										userId: parent.authorId,
										selfPresence: presence,
										size: "sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold",
										children: userById(parent.authorId).name
									}),
									parent.authorId === "u_me" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-ink-faint",
										children: "You"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("time", {
										dateTime: parent.createdAt,
										title: absoluteTime(parent.createdAt),
										className: "text-xs text-ink-faint tabular-nums",
										children: [timeLabel(parent.createdAt), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "sr-only",
											children: [", ", absoluteTime(parent.createdAt)]
										})]
									}),
									parent.editedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-ink-faint",
										children: "(edited)"
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBody, { text: parent.body })
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: "This message was deleted."
					})
				}), replies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-6 text-sm text-ink-soft",
					children: "No replies yet. Start the thread below."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageList, {
					mode: "thread",
					conversationId: parent?.conversationId ?? "",
					messages: replies,
					emptyTitle: "No replies yet",
					emptyBody: "Start the thread below."
				})]
			}),
			parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 border-t border-line px-3 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
					draftKey: `thread:${parent.id}`,
					fieldId: "thread-composer",
					conversationId: parent.conversationId,
					parentId: parent.id,
					placeholder: "Reply in thread"
				})
			}) : null
		]
	});
}
function Welcome({ onEnter }) {
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-dvh flex-col bg-plum text-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-8 px-4 py-10 md:flex-row md:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex size-12 items-center justify-center rounded-xl bg-paper text-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitMark, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-3xl font-semibold text-balance",
						children: "Orbit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-md text-base leading-normal text-plum-muted",
						children: "A quiet place for the launch desk. Channels, threads, and direct messages, kept on this device."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-6 inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
						onClick: () => {
							writeSession();
							onEnter();
						},
						children: "Continue to demo"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "signin-title",
				className: "w-full max-w-sm rounded-xl bg-paper p-5 text-ink",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "signin-title",
						className: "text-lg font-semibold",
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: "Preview only — account sign-in is unavailable."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 grid gap-3",
						onSubmit: (event) => event.preventDefault(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1 text-sm font-medium",
								htmlFor: "orbit-email",
								children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "orbit-email",
									name: "email",
									type: "email",
									autoComplete: "username",
									disabled: true,
									className: "h-11 rounded-md border border-line bg-paper px-3 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1 text-sm font-medium",
								htmlFor: "orbit-password",
								children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "orbit-password",
									name: "password",
									type: showPassword ? "text" : "password",
									autoComplete: "current-password",
									disabled: true,
									className: "h-11 rounded-md border border-line bg-paper px-3 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "justify-self-start text-sm font-medium text-ink-soft underline",
								onClick: () => setShowPassword((value) => !value),
								children: showPassword ? "Hide password" : "Show password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									disabled: true,
									name: "remember"
								}), "Remember me"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: true,
								className: "h-11 rounded-md bg-line text-sm font-semibold text-ink-faint",
								children: "Submit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-ink-faint",
								children: "Forgot password isn’t available in this demo."
							})
						]
					})
				]
			})]
		})
	});
}
var RETURN_KEY = "orbit:return";
function OrbitApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [authed, setAuthed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const existing = readSession();
		if (!existing && location.hash.length > 1) sessionStorage.setItem(RETURN_KEY, location.hash);
		if (existing) enterDemo();
		setAuthed(Boolean(existing));
		setReady(true);
		const onSignOut = () => {
			clearSession();
			history.replaceState(null, "", location.pathname);
			setAuthed(false);
		};
		window.addEventListener("orbit-signout", onSignOut);
		return () => window.removeEventListener("orbit-signout", onSignOut);
	}, []);
	if (!ready) return null;
	if (!authed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Welcome, { onEnter: () => {
		enterDemo();
		setAuthed(true);
	} });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthedApp, {});
}
function enterDemo() {
	const pending = sessionStorage.getItem(RETURN_KEY);
	if (pending && location.hash.length <= 1) location.hash = pending;
	sessionStorage.removeItem(RETURN_KEY);
	useOrbit.getState().hydrate();
}
function AuthedApp() {
	(0, import_react.useEffect)(() => {
		useOrbit.getState().hydrate();
	}, []);
	(0, import_react.useEffect)(() => {
		const shell = document.getElementById("orbit-shell");
		const viewport = window.visualViewport;
		if (!shell || !viewport) return;
		const sync = () => {
			shell.style.height = `${viewport.height}px`;
			shell.style.transform = viewport.offsetTop ? `translateY(${viewport.offsetTop}px)` : "";
			document.documentElement.style.setProperty("--orbit-vvh", `${viewport.height}px`);
			document.documentElement.style.setProperty("--orbit-vv-top", `${viewport.offsetTop}px`);
		};
		sync();
		viewport.addEventListener("resize", sync);
		viewport.addEventListener("scroll", sync);
		return () => {
			viewport.removeEventListener("resize", sync);
			viewport.removeEventListener("scroll", sync);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const query = window.matchMedia("(min-width: 768px)");
		const onChange = () => {
			if (query.matches) useOrbit.getState().setNavOpen(false);
		};
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
			const target = event.target;
			if (target instanceof HTMLElement && target.closest("input, textarea, [contenteditable='true']")) return;
			event.preventDefault();
			const state = useOrbit.getState();
			if (state.searchOpen) state.setSearchOpen(false);
			else state.openSearch(null);
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitShell, {});
}
function OrbitShell() {
	const liveMessage = useOrbit((state) => state.liveMessage);
	const createdMessages = useOrbit((state) => state.createdMessages);
	const edited = useOrbit((state) => state.edited);
	const deletedIds = useOrbit((state) => state.deletedIds);
	const reactionOverrides = useOrbit((state) => state.reactionOverrides);
	const view = useOrbit((state) => state.view);
	const conversationId = useOrbit((state) => state.conversationId);
	const extra = useOrbit((state) => state.extraConversations);
	const threadParentId = useOrbit((state) => state.threadParentId);
	const messages = (0, import_react.useMemo)(() => assembleMessages({
		createdMessages,
		edited,
		deletedIds,
		reactionOverrides
	}), [
		createdMessages,
		edited,
		deletedIds,
		reactionOverrides
	]);
	(0, import_react.useEffect)(() => {
		const conversation = conversationById(conversationsOf(extra), conversationId);
		const title = conversation ? conversation.kind === "channel" ? `#${conversationTitle(conversation)} · Orbit` : `${conversationTitle(conversation)} · Orbit` : "Orbit";
		document.title = title;
	}, [conversationId, extra]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "orbit-shell",
		className: "flex h-dvh overflow-hidden bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#conversation",
				className: "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2",
				children: "Skip to conversation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden h-full md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceRail, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden h-full w-sidebar-xs shrink-0 md:block lg:w-sidebar-sm xl:w-sidebar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, { messages })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative flex min-h-0 min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallRuntime, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallReturnBar, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallSurfaces, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex min-h-0 min-w-0 flex-1",
						children: [
							view === "activity" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityView, { messages }) : null,
							view === "later" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaterView, { messages }) : null,
							view === "conversation" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationPane, { messages }) : null,
							view === "conversation" && threadParentId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Close thread",
								className: "absolute inset-0 z-20 bg-ink/30 max-md:hidden xl:hidden",
								onClick: () => useOrbit.getState().closeThread()
							}) : null,
							view === "conversation" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadPane, { messages }) : null
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNav, { messages }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, { messages }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitDialogs, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { position: "bottom-center" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				"aria-live": "polite",
				children: liveMessage
			})
		]
	});
}
var SplitComponent = OrbitApp;
//#endregion
export { localTracks as a, stopCallTracks as c, SplitComponent as component, forgetFile as i, routes_cMiwGDKo_exports as l, explainMediaError as n, rememberFile as o, fileUrl as r, setTrackEnabled as s, captureMedia as t };
