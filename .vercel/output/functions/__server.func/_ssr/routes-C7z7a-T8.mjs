import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as Bookmark, S as ChevronDown, T as Bell, _ as House, a as Trash2, b as Copy, c as Search, d as Pencil, f as Paperclip, g as Italic, h as Link2, l as Plus, m as Menu, n as Users, o as Smile, p as MessageSquare, r as UserRound, s as Send, t as X, u as Pin, v as Hash, w as Bold, x as Code, y as Ellipsis } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as RadioItem2, c as Trigger, i as RadioGroup2, n as Item2, o as Root2, r as Portal2, s as Separator2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as isToday, r as format, t as isYesterday } from "../_libs/date-fns.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C7z7a-T8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var YOU = "rowan";
var STORAGE_KEY = "orbit:v1";
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
		id: "rowan",
		name: "Rowan Hale",
		handle: "rowan",
		initials: "RH",
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
	"rowan",
	"priya",
	"noah",
	"jules",
	"lena",
	"samir",
	"avery",
	"kai"
];
var SEED_WORKSPACES = [{
	id: "orbit",
	name: "Orbit",
	initials: "OR"
}, {
	id: "lumen",
	name: "Lumen",
	initials: "LU"
}];
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
		participantIds: ["rowan", "priya"]
	},
	{
		kind: "dm",
		id: "dm-noah",
		workspaceId: "orbit",
		participantIds: ["rowan", "noah"]
	},
	{
		kind: "dm",
		id: "dm-kai",
		workspaceId: "orbit",
		participantIds: ["rowan", "kai"]
	},
	{
		kind: "dm",
		id: "dm-launch",
		workspaceId: "orbit",
		participantIds: [
			"rowan",
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
			"rowan",
			"mina",
			"theo"
		]
	}
];
function stamp(daysAgo, hour, minute) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() - daysAgo);
	d.setHours(hour, minute, 0, 0);
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
		authorId: "rowan",
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
		id: "gen-shots",
		conversationId: "general",
		authorId: "noah",
		createdAt: stamp(0, 9, 22),
		body: "Marketing screenshots are in the shared folder, named by frame. Please don’t re-export them — the type was hand-kerned."
	}),
	msg({
		id: "gen-social",
		conversationId: "general",
		authorId: "avery",
		createdAt: stamp(0, 9, 40),
		body: "Social is drafted, not scheduled. If we slip past noon I’ll pull the thread rather than let it go out half-true.",
		reactions: [{
			emoji: "👍",
			userIds: ["rowan", "jules"]
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
		authorId: "rowan",
		createdAt: stamp(1, 16, 5),
		body: "Agreed. Customer-facing notes are in the [launch checklist](https://example.com/orbit-checklist). I’ll trim anything that sounds like a roadmap."
	}),
	msg({
		id: "prod-mention",
		conversationId: "product",
		authorId: "jules",
		createdAt: stamp(0, 10, 14),
		body: "@rowan can you confirm the checklist before 4? Legal wants the “what’s new” bullets, and Avery is holding the post until those are final.",
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
			userIds: ["lena", "rowan"]
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
		authorId: "rowan",
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
			userIds: ["rowan", "lena"]
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
		authorId: "rowan",
		createdAt: stamp(1, 15, 20),
		body: "They can share one accent. The badge is a few characters. The button is the only solid control. If both yell, we shrink the badge, not the button."
	}),
	msg({
		id: "design-final",
		conversationId: "design",
		authorId: "noah",
		createdAt: stamp(0, 11, 5),
		body: "Final hero is in the folder. I’ll post the announcement crop once Avery locks the headline — not before."
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
			userIds: ["rowan", "jules"]
		}]
	}),
	msg({
		id: "eng-notes",
		conversationId: "engineering",
		authorId: "rowan",
		createdAt: stamp(1, 12, 44),
		body: "If that stays green, we don’t mention it in the launch notes. Quiet fixes can stay quiet."
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
			userIds: ["jules", "rowan"]
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
		authorId: "rowan",
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
		authorId: "rowan",
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
		authorId: "rowan",
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
	return items[items.length - 1]?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString();
}
var INITIAL_LAST_READ = {
	general: latestIn("general"),
	product: justBefore("prod-mention"),
	design: latestIn("design"),
	engineering: latestIn("engineering"),
	announcements: latestIn("announcements"),
	random: justBefore("rand-coffee"),
	"dm-priya": latestIn("dm-priya"),
	"dm-noah": latestIn("dm-noah"),
	"dm-kai": justBefore("dm-k1"),
	"dm-launch": latestIn("dm-launch"),
	"lumen-general": latestIn("lumen-general")
};
var AVATAR_CLASS = {
	rowan: "bg-avatar-rowan",
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
	if (userId === "rowan") return selfPresence;
	return userById(userId).presence;
}
function presenceLabel(presence) {
	if (presence === "online") return "Online";
	if (presence === "away") return "Away";
	return "Offline";
}
function workspacesOf(extra) {
	return [...SEED_WORKSPACES, ...extra];
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
	return conversation.participantIds.filter((id) => id !== "rowan").map((id) => userById(id).name).join(", ") || "You";
}
function peopleLabel(ids) {
	const names = ids.filter((id) => id !== YOU).map((id) => userById(id).name);
	if (names.length === 0) return "Just you";
	if (names.length === 1) return names[0] ?? "Just you";
	if (names.length === 2) return `${names[0]} and ${names[1]}`;
	return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
function rootMessages(messages, conversationId) {
	return messages.filter((message) => message.conversationId === conversationId && !message.parentId);
}
function threadReplies(messages, parentId) {
	return messages.filter((message) => message.parentId === parentId);
}
function replyCount(messages, parentId) {
	return threadReplies(messages, parentId).length;
}
function unreadMeta(messages, conversationId, lastRead) {
	const cutoff = lastRead ? new Date(lastRead).getTime() : 0;
	const fresh = rootMessages(messages, conversationId).filter((message) => message.authorId !== "rowan" && new Date(message.createdAt).getTime() > cutoff);
	const mention = fresh.some((message) => new RegExp(`@${YOU}\\b`, "i").test(message.body));
	return {
		unread: fresh.length,
		mention
	};
}
function groupMessages(messages) {
	const groups = [];
	for (const message of messages) {
		const last = groups[groups.length - 1];
		const prev = last?.messages[last.messages.length - 1];
		if (prev && last && last.authorId === message.authorId && new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime() < FIVE_MINUTES && new Date(message.createdAt).toDateString() === new Date(prev.createdAt).toDateString() && last) last.messages.push(message);
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
	const participated = new Set(messages.filter((message) => message.authorId === "rowan" && message.parentId).map((message) => message.parentId));
	const items = [];
	for (const message of messages) {
		if (message.authorId === "rowan") continue;
		const mention = new RegExp(`@${YOU}\\b`, "i").test(message.body);
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
	savedIds: [],
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
		savedIds: state.savedIds,
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
	navOpen: false,
	channelDialog: false,
	workspaceDialog: false,
	statusDialog: false,
	prefsDialog: false,
	hydrate: () => {
		if (get().hydrated) return;
		const base = EMPTY_PERSISTED();
		const saved = readPersisted();
		const next = saved ? {
			...base,
			...saved,
			drafts: saved.drafts ?? base.drafts,
			savedIds: saved.savedIds ?? base.savedIds,
			collapsed: {
				...base.collapsed,
				...saved.collapsed
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
		set({
			workspaceId: conversation.workspaceId,
			conversationId: id,
			view: "conversation",
			navOpen: false,
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
	},
	setView: (view) => {
		set({
			view,
			navOpen: false
		});
		persist(get);
	},
	toggleSection: (key) => {
		set({ collapsed: {
			...get().collapsed,
			[key]: !get().collapsed[key]
		} });
		persist(get);
	},
	setDraft: (key, value) => {
		set({ drafts: {
			...get().drafts,
			[key]: value
		} });
		persist(get);
	},
	sendMessage: ({ conversationId, body, parentId, attachment, draftKey }) => {
		const trimmed = body.trim();
		if (!trimmed) return;
		const message = {
			id: `m-${crypto.randomUUID()}`,
			conversationId,
			authorId: YOU,
			body: trimmed,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			parentId,
			reactions: [],
			attachments: attachment ? [attachment] : void 0
		};
		const drafts = { ...get().drafts };
		delete drafts[draftKey];
		set({
			createdMessages: [...get().createdMessages, message],
			drafts,
			lastRead: {
				...get().lastRead,
				[conversationId]: message.createdAt
			}
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
		if (existing) existing.userIds = existing.userIds.includes("rowan") ? existing.userIds.filter((id) => id !== YOU) : [...existing.userIds, YOU];
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
		const saved = new Set(get().savedIds);
		if (saved.has(messageId)) saved.delete(messageId);
		else saved.add(messageId);
		set({ savedIds: [...saved] });
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
		const threadParentId = get().threadParentId === messageId ? null : get().threadParentId;
		set({
			deletedIds: [...get().deletedIds, messageId],
			threadParentId
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
			view: "conversation"
		});
		persist(get);
	},
	closeThread: () => {
		set({ threadParentId: null });
		persist(get);
	},
	highlight: (messageId) => {
		set({ highlightId: messageId });
		window.setTimeout(() => {
			if (get().highlightId === messageId) set({ highlightId: null });
		}, 2400);
	},
	focusMessage: (messageId) => {
		const message = assembleMessages(get()).find((item) => item.id === messageId);
		if (!message) return;
		const parentId = message.parentId;
		get().openConversation(message.conversationId, { keepThread: Boolean(parentId) });
		if (parentId) set({ threadParentId: parentId });
		get().highlight(message.parentId ? message.id : message.id);
		persist(get);
	},
	setSearchOpen: (searchOpen) => set({ searchOpen }),
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
		const state = get();
		const conversations = conversationsOf(state.extraConversations).filter((item) => item.workspaceId === state.workspaceId && item.kind === "channel");
		const next = conversations.find((item) => item.id === state.lastChannel[state.workspaceId]) ?? conversations[0];
		if (next) get().openConversation(next.id);
		else set({
			view: "conversation",
			navOpen: false
		});
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
	}
}));
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
function WorkspaceRail() {
	const workspaceId = useOrbit((state) => state.workspaceId);
	const extras = useOrbit((state) => state.extraWorkspaces);
	const presence = useOrbit((state) => state.presence);
	const setWorkspace = useOrbit((state) => state.setWorkspace);
	const goHome = useOrbit((state) => state.goHome);
	const workspaces = workspacesOf(extras);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Workspaces",
		className: "flex h-full w-rail shrink-0 flex-col items-center gap-3 bg-plum py-3 text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Orbit home",
				onClick: goHome,
				className: "inline-flex size-11 items-center justify-center rounded-lg bg-paper text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitMark, { className: "size-7" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center gap-2",
				children: [workspaces.map((workspace) => {
					const active = workspace.id === workspaceId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-current": active ? "true" : void 0,
						"aria-label": workspace.name,
						onClick: () => setWorkspace(workspace.id),
						className: cn("relative inline-flex size-11 items-center justify-center rounded-lg text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", active ? "bg-paper text-ink" : "bg-plum-raised text-paper hover:bg-plum-hover"),
						children: [active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -left-3 h-5 w-1 rounded-full bg-paper",
							"aria-hidden": "true"
						}) : null, workspace.id === "orbit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitMark, { className: "size-5" }) : workspace.initials]
					}, workspace.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Add a workspace",
					onClick: () => useOrbit.getState().setWorkspaceDialog(true),
					className: "inline-flex size-11 items-center justify-center rounded-lg border border-plum-line text-plum-muted hover:bg-plum-hover hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileMenu, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Your profile",
				className: "relative rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					userId: YOU,
					selfPresence: presence,
					showPresence: true
				})
			}) })
		]
	});
}
function Sidebar({ messages, onNavigate }) {
	const workspaceId = useOrbit((state) => state.workspaceId);
	const conversationId = useOrbit((state) => state.conversationId);
	const view = useOrbit((state) => state.view);
	const collapsed = useOrbit((state) => state.collapsed);
	const extras = useOrbit((state) => state.extraWorkspaces);
	const extraConversations = useOrbit((state) => state.extraConversations);
	const lastRead = useOrbit((state) => state.lastRead);
	const workspace = workspacesOf(extras).find((item) => item.id === workspaceId);
	const conversations = conversationsOf(extraConversations).filter((item) => item.workspaceId === workspaceId);
	const channels = conversations.filter((item) => item.kind === "channel");
	const dms = conversations.filter((item) => item.kind === "dm");
	const current = conversations.find((item) => item.id === conversationId);
	const [mod, setMod] = (0, import_react.useState)("Ctrl");
	(0, import_react.useEffect)(() => {
		setMod(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 w-full flex-col bg-plum-raised text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 px-3 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceMenu, { name: workspace?.name ?? "Orbit" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						useOrbit.getState().setSearchOpen(true);
						onNavigate?.();
					},
					className: "flex h-11 w-full items-center gap-2 rounded-md border border-plum-line bg-plum px-3 text-left text-sm text-plum-muted hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
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
					onToggle: () => useOrbit.getState().toggleSection("channels"),
					onAdd: () => useOrbit.getState().setChannelDialog(true),
					children: channels.map((channel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationButton, {
						conversation: channel,
						active: view === "conversation" && conversationId === channel.id,
						meta: unreadMeta(messages, channel.id, lastRead[channel.id]),
						onClick: () => {
							useOrbit.getState().openConversation(channel.id);
							onNavigate?.();
						}
					}, channel.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "Direct messages",
					collapsed: collapsed.dms,
					onToggle: () => useOrbit.getState().toggleSection("dms"),
					children: dms.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-2 text-sm text-plum-faint",
						children: "No direct messages yet."
					}) : dms.map((dm) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationButton, {
						conversation: dm,
						active: view === "conversation" && conversationId === dm.id,
						meta: unreadMeta(messages, dm.id, lastRead[dm.id]),
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
function NavButton({ icon, label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-current": active ? "page" : void 0,
		onClick,
		className: cn("flex h-11 items-center gap-2 rounded-md px-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:h-9", active ? "bg-paper font-semibold text-ink" : "text-plum-muted hover:bg-plum-hover hover:text-paper"),
		children: [icon, label]
	});
}
function Section({ label, collapsed, onToggle, onAdd, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-expanded": !collapsed,
				onClick: onToggle,
				className: "flex flex-1 items-center gap-1 rounded-md px-1 py-1 text-left text-xs font-semibold tracking-wide text-plum-faint uppercase hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-3.5 transition-transform duration-quick", collapsed && "-rotate-90") }), label]
			}), onAdd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `Add to ${label}`,
				onClick: onAdd,
				className: "inline-flex size-8 items-center justify-center rounded-md text-plum-faint hover:bg-plum-hover hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-current": active ? "page" : void 0,
		onClick,
		className: cn("flex h-11 w-full items-center gap-2 rounded-md px-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:h-8", active ? "bg-paper font-semibold text-ink" : unread ? "font-semibold text-paper hover:bg-plum-hover" : "font-medium text-plum-muted hover:bg-plum-hover hover:text-paper"),
		children: [
			conversation.kind === "channel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
				className: "size-3.5 shrink-0",
				"aria-hidden": "true"
			}) : conversation.title || conversation.participantIds.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-plum text-xs font-semibold text-paper",
				children: (conversation.title ?? "Group").slice(0, 1)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				userId: conversation.participantIds.find((id) => id !== "rowan") ?? "rowan",
				selfPresence: presence,
				size: "sm",
				showPresence: conversation.participantIds.filter((id) => id !== YOU).length === 1
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1 truncate",
				children: [title, unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: meta.mention ? ", mention" : ", unread"
				}) : null]
			}),
			unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-1.5 rounded-full bg-current",
						"aria-hidden": "true"
					}),
					meta.mention ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-sm bg-accent px-1 text-xs font-semibold text-accent-ink",
						children: "@"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs tabular-nums",
						children: meta.unread
					})
				]
			}) : null
		]
	});
}
function WorkspaceMenu({ name }) {
	const workspaceId = useOrbit((state) => state.workspaceId);
	const workspaces = workspacesOf(useOrbit((state) => state.extraWorkspaces));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex min-w-0 flex-1 items-center gap-1 rounded-md px-1 py-1 text-left text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
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
			workspaces.map((workspace) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item2, {
				onSelect: () => useOrbit.getState().setWorkspace(workspace.id),
				className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("inline-flex size-6 items-center justify-center rounded-md text-xs font-semibold text-paper", workspace.id === "orbit" ? "bg-plum" : avatarClass("lena")),
						children: workspace.initials.slice(0, 2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 truncate",
						children: workspace.name
					}),
					workspace.id === workspaceId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-ink-faint",
						children: "Current"
					}) : null
				]
			}, workspace.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, { className: "my-1 h-px bg-line" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item2, {
				onSelect: () => useOrbit.getState().setWorkspaceDialog(true),
				className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "size-4",
					"aria-hidden": "true"
				}), "Create a workspace"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
				onSelect: () => {
					navigator.clipboard.writeText(`${location.origin}/invite/${workspaceId}`).then(() => toast("Invite link copied. Invites stay on this device."), () => toast("Couldn’t copy an invite link."));
				},
				className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line",
				children: "Copy invite link"
			})
		]
	}) })] });
}
function ProfileMenu({ children }) {
	const presence = useOrbit((state) => state.presence);
	const status = useOrbit((state) => state.status);
	const you = userById(YOU);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
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
				children: [
					"online",
					"away",
					"offline"
				].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioItem2, {
					value,
					className: "cursor-pointer rounded-md px-2 py-2 outline-none data-highlighted:bg-line",
					children: presenceLabel(value)
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
				onSelect: () => toast("You’re Rowan Hale on this device. Signing out isn’t connected."),
				children: "Sign out"
			})
		]
	}) })] });
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
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-ink/40 lg:hidden" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			"aria-describedby": void 0,
			className: "orbit-pop fixed inset-y-0 left-0 z-50 flex w-full max-w-sm bg-plum outline-none lg:hidden",
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
					className: "absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-md text-paper hover:bg-plum-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})
			]
		})] })
	});
}
function Composer({ draftKey, placeholder, conversationId, parentId, labelledBy }) {
	const draft = useOrbit((state) => state.drafts[draftKey] ?? "");
	const setDraft = useOrbit((state) => state.setDraft);
	const sendMessage = useOrbit((state) => state.sendMessage);
	const field = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const [attachment, setAttachment] = (0, import_react.useState)(null);
	const [linkOpen, setLinkOpen] = (0, import_react.useState)(false);
	const [linkUrl, setLinkUrl] = (0, import_react.useState)("https://");
	const canSend = draft.trim().length > 0;
	(0, import_react.useEffect)(() => {
		if (!draft && field.current) field.current.style.height = "auto";
	}, [draft]);
	function write(next, selection) {
		setDraft(draftKey, next);
		requestAnimationFrame(() => {
			const node = field.current;
			if (!node) return;
			node.focus();
			if (selection) node.setSelectionRange(selection[0], selection[1]);
		});
	}
	function insert(text) {
		const node = field.current;
		const start = node?.selectionStart ?? draft.length;
		const end = node?.selectionEnd ?? draft.length;
		const next = draft.slice(0, start) + text + draft.slice(end);
		const cursor = start + text.length;
		write(next, [cursor, cursor]);
	}
	function wrap(before, after) {
		const node = field.current;
		const start = node?.selectionStart ?? draft.length;
		const end = node?.selectionEnd ?? draft.length;
		const selected = draft.slice(start, end) || "text";
		const next = `${draft.slice(0, start)}${before}${selected}${after}${draft.slice(end)}`;
		const innerStart = start + before.length;
		write(next, [innerStart, innerStart + selected.length]);
	}
	function send() {
		if (!canSend) return;
		sendMessage({
			conversationId,
			body: draft,
			parentId,
			attachment: attachment ?? void 0,
			draftKey
		});
		setAttachment(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-paper-raised focus-within:border-accent",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "sr-only",
				htmlFor: draftKey,
				children: placeholder
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: draftKey,
				ref: field,
				"aria-labelledby": labelledBy,
				rows: 1,
				value: draft,
				placeholder,
				onChange: (event) => {
					setDraft(draftKey, event.target.value);
					const node = event.target;
					node.style.height = "auto";
					node.style.height = `${Math.min(node.scrollHeight, 160)}px`;
				},
				onKeyDown: (event) => {
					if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
						event.preventDefault();
						send();
					}
				},
				className: "max-h-40 min-h-11 w-full resize-none bg-transparent px-3 py-3 text-sm leading-normal outline-none placeholder:text-ink-faint"
			}),
			attachment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex max-w-full items-center gap-2 rounded-md border border-line bg-paper px-2 py-1 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, {
							className: "size-3.5 shrink-0",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: attachment.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink-faint tabular-nums",
							children: formatBytes(attachment.size)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-sm p-1 text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
							"aria-label": "Remove attachment",
							onClick: () => setAttachment(null),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
						})
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 px-2 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
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
							onClick: () => insert(emoji),
							children: emoji
						}, emoji))
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton, {
						label: "Attach a file",
						onClick: () => fileRef.current?.click(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						className: "sr-only",
						onChange: (event) => {
							const file = event.target.files?.[0];
							if (!file) return;
							setAttachment({
								id: crypto.randomUUID(),
								name: file.name,
								size: file.size
							});
							event.target.value = "";
						}
					}),
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
									const node = field.current;
									const start = node?.selectionStart ?? draft.length;
									const end = node?.selectionEnd ?? draft.length;
									const markdown = `[${draft.slice(start, end) || url}](${url})`;
									write(draft.slice(0, start) + markdown + draft.slice(end), [start + markdown.length, start + markdown.length]);
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
					}),
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
function ToolbarButton({ label, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: cn("inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:size-8"),
		children
	});
}
var HANDLES = new Set(USERS.map((user) => user.handle));
function renderInline(text) {
	const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|(https?:\/\/[^\s<]+)|\B@([a-z0-9-]+)/gi;
	const nodes = [];
	let last = 0;
	let match;
	let key = 0;
	while (match = pattern.exec(text)) {
		if (match.index > last) nodes.push(text.slice(last, match.index));
		if (match[1] && match[2]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: match[2],
			target: "_blank",
			rel: "noreferrer",
			className: "font-medium text-accent underline",
			children: match[1]
		}, key++));
		else if (match[3]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-sm bg-line px-1 py-0.5 font-mono text-xs",
			children: match[3]
		}, key++));
		else if (match[4]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold",
			children: match[4]
		}, key++));
		else if (match[5]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
			className: "italic",
			children: match[5]
		}, key++));
		else if (match[6]) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: match[6],
			target: "_blank",
			rel: "noreferrer",
			className: "font-medium text-accent underline",
			children: match[6]
		}, key++));
		else if (match[7] && HANDLES.has(match[7].toLowerCase())) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-sm bg-accent/10 px-1 font-semibold text-accent",
			children: ["@", match[7]]
		}, key++));
		else nodes.push(match[0]);
		last = match.index + match[0].length;
	}
	if (last < text.length) nodes.push(text.slice(last));
	return nodes;
}
function MessageBody({ text }) {
	const lines = text.split("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "break-words text-sm leading-normal text-pretty",
		children: lines.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [index > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}) : null, line.length > 0 ? renderInline(line) : null] }, index))
	});
}
function MessageList({ conversationId, messages, emptyTitle, emptyBody, mode = "channel" }) {
	const highlightId = useOrbit((state) => state.highlightId);
	const bottom = (0, import_react.useRef)(null);
	const roots = mode === "thread" ? messages : messages.filter((message) => message.conversationId === conversationId && !message.parentId);
	const days = bucketByDay(roots);
	(0, import_react.useEffect)(() => {
		if (highlightId && document.getElementById(`msg-${highlightId}`)) {
			document.getElementById(`msg-${highlightId}`)?.scrollIntoView({ block: "center" });
			return;
		}
		bottom.current?.scrollIntoView({ block: "end" });
	}, [
		conversationId,
		roots.length,
		highlightId
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
		className: mode === "thread" ? "w-full" : "min-h-0 flex-1 overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-3xl flex-col py-3",
			children: [days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-label": day.label,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "sticky top-0 z-10 mx-4 my-2 bg-paper/95 py-1 text-center text-xs font-semibold tracking-wide text-ink-faint",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-line bg-paper-raised px-3 py-1",
						children: day.label
					})
				}), groupMessages(day.messages).map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageGroupView, {
					group,
					allMessages: messages,
					inThread: mode === "thread"
				}, group.id))]
			}, day.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottom })]
		})
	});
}
function MessageGroupView({ group, allMessages, inThread }) {
	const alwaysShowTime = useOrbit((state) => state.alwaysShowTime);
	const presence = useOrbit((state) => state.presence);
	const author = userById(group.authorId);
	const yours = group.authorId === YOU;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative px-2 py-0.5",
		children: [yours ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-2 bottom-2 left-0 w-1 rounded-full bg-accent",
			"aria-hidden": "true"
		}) : null, group.messages.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageRow, {
			message,
			grouped: index > 0,
			showTime: index === 0 || alwaysShowTime,
			authorName: author.name,
			yours,
			presence,
			replies: inThread ? 0 : replyCount(allMessages, message.id),
			inThread
		}, message.id))]
	});
}
function MessageRow({ message, grouped, showTime, authorName, yours, presence, replies, inThread }) {
	const highlightId = useOrbit((state) => state.highlightId);
	const saved = useOrbit((state) => state.savedIds.includes(message.id));
	const [menu, setMenu] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(message.body);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: `msg-${message.id}`,
		className: cn("group relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2 rounded-md px-2 py-1 hover:bg-ink/5", highlightId === message.id && "bg-accent/10", menu && "bg-ink/5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-0.5",
				children: grouped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
					dateTime: message.createdAt,
					className: cn("text-xs text-ink-faint tabular-nums", !showTime && "sr-only group-hover:not-sr-only group-focus-within:not-sr-only"),
					children: timeLabel(message.createdAt)
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
								dateTime: message.createdAt,
								className: "text-xs text-ink-faint tabular-nums",
								children: timeLabel(message.createdAt)
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
					message.attachments?.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 inline-flex max-w-full items-center gap-2 rounded-md border border-line bg-paper-raised px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-medium",
							children: file.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-ink-faint tabular-nums",
							children: formatBytes(file.size)
						})]
					}, file.id)),
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
				className: cn("absolute top-0 right-3 z-20 flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-line bg-paper-raised p-0.5 shadow-pop", menu ? "opacity-100" : "pointer-events-none opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2$1, {
						open: menu === "react",
						onOpenChange: (open) => setMenu(open ? "react" : null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								label: "React",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
							side: "top",
							align: "end",
							className: "orbit-pop z-50 grid grid-cols-8 gap-1 rounded-lg border border-line bg-paper-raised p-2 shadow-pop",
							children: EMOJIS.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
						onClick: () => useOrbit.getState().openThread(message.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
						label: saved ? "Remove from Later" : "Save for later",
						pressed: saved,
						onClick: () => useOrbit.getState().toggleSaved(message.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: cn("size-4", saved && "fill-current") })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, {
						open: menu === "more",
						onOpenChange: (open) => setMenu(open ? "more" : null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								label: "More actions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
							align: "end",
							className: "orbit-pop z-50 min-w-44 rounded-lg border border-line bg-paper-raised p-1 text-sm shadow-pop",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuItem, {
									onSelect: () => {
										copyMessageLink(message);
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
									onSelect: () => {
										useOrbit.getState().deleteMessage(message.id);
										toast("Message deleted", { action: {
											label: "Undo",
											onClick: () => useOrbit.getState().undoDelete(message.id)
										} });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Delete"]
								}) : null
							]
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
		className: "mt-1 flex flex-wrap gap-1",
		children: message.reactions.map((reaction) => {
			const mine = reaction.userIds.includes(YOU);
			const names = reaction.userIds.map((id) => id === "rowan" ? "You" : userById(id).name).join(", ");
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
	} catch {
		toast("Couldn’t copy the link");
	}
}
function ActionButton({ label, children, onClick, pressed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		"aria-pressed": pressed,
		onClick,
		className: "inline-flex size-8 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
		children
	});
}
function MenuItem({ children, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		onSelect,
		className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line",
		children
	});
}
function ConversationPane({ messages }) {
	const conversationId = useOrbit((state) => state.conversationId);
	const extra = useOrbit((state) => state.extraConversations);
	const presence = useOrbit((state) => state.presence);
	const conversation = conversationById(conversationsOf(extra), conversationId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "conversation",
		"aria-label": "Conversation",
		className: "flex min-h-0 min-w-0 flex-1 flex-col bg-paper",
		children: [conversation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationHeader, {
			conversation,
			messages,
			presence
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
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
					conversationId: conversation.id,
					placeholder: conversation.kind === "channel" ? `Message #${conversation.name}` : `Message ${conversationTitle(conversation)}`
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
function MenuButton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Open navigation",
		onClick: () => useOrbit.getState().setNavOpen(true),
		className: "inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
	});
}
function ConversationHeader({ conversation, messages, presence }) {
	const title = conversationTitle(conversation);
	const members = memberIds(conversation);
	const others = members.filter((id) => id !== YOU);
	const subtitle = conversation.kind === "channel" ? conversation.description : others.length === 1 ? `${userById(others[0] ?? "").title} · ${presenceLabel(presenceOf(others[0] ?? "", presence))}` : peopleLabel(members);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 lg:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 items-center gap-2",
				children: [conversation.kind === "channel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
					className: "size-4 shrink-0 text-ink-soft",
					"aria-hidden": "true"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					userId: others[0] ?? "rowan",
					selfPresence: presence,
					size: "sm",
					showPresence: others.length === 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						id: "conversation-title",
						className: "truncate text-base font-semibold",
						children: conversation.kind === "channel" ? title : title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Search",
				onClick: () => useOrbit.getState().setSearchOpen(true),
				className: "inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:size-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
			})
		]
	});
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
				"aria-label": "Conversation details",
				className: "inline-flex size-11 items-center justify-center gap-1 rounded-md px-2 text-xs font-medium text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:size-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
					className: "size-4",
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: count
				})]
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameDialog, {
			openKey: "workspaceDialog",
			title: "Create a workspace",
			description: "It stays on this device, with a single general channel.",
			fieldLabel: "Workspace name",
			submitLabel: "Create workspace",
			onSubmit: (name) => useOrbit.getState().createWorkspace(name)
		}),
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
function NameDialog({ openKey, title, description, fieldLabel, submitLabel, onSubmit }) {
	const open = useOrbit((state) => state[openKey]);
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		open,
		onOpenChange: (next) => {
			useOrbit.getState().setWorkspaceDialog(next);
			if (!next) {
				setName("");
				setError(null);
			}
		},
		title,
		description,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 flex flex-col gap-3",
			onSubmit: (event) => {
				event.preventDefault();
				const result = onSubmit(name);
				setError(result);
				if (!result) setName("");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "workspace-name",
					label: fieldLabel,
					value: name,
					onChange: setName
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Submit, { label: submitLabel })
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
	const conversations = conversationsOf(extra).filter((item) => item.workspaceId === workspaceId);
	const items = activityItems(messages).filter((item) => conversations.some((conversation) => conversation.id === item.conversationId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Activity",
		className: "flex min-h-0 min-w-0 flex-1 flex-col bg-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaneHeader, {
			title: "Activity",
			detail: "Mentions and threads you’re in"
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "You’re caught up",
			body: "Mentions and replies in your threads will show up here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "min-h-0 flex-1 overflow-y-auto",
			children: items.map((item) => {
				const conversation = conversationById(conversations, item.conversationId);
				const where = conversation ? conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation) : "a conversation";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => useOrbit.getState().focusMessage(item.message.id),
					className: "flex w-full gap-3 border-b border-line px-4 py-3 text-left hover:bg-ink/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block truncate text-sm",
								children: snippet(item.message.body)
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
	const extra = useOrbit((state) => state.extraConversations);
	const saved = messages.filter((message) => savedIds.includes(message.id));
	const conversations = conversationsOf(extra);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Later",
		className: "flex min-h-0 min-w-0 flex-1 flex-col bg-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaneHeader, {
			title: "Later",
			detail: "Messages you saved on this device"
		}), saved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "Nothing saved",
			body: "Hover a message and choose Save for later. It will wait here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "min-h-0 flex-1 overflow-y-auto",
			children: saved.map((message) => {
				const conversation = conversationById(conversations, message.conversationId);
				const where = conversation ? conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation) : "Conversation";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2 border-b border-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => useOrbit.getState().focusMessage(message.id),
						className: "flex min-w-0 flex-1 gap-3 px-4 py-3 text-left hover:bg-ink/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							userId: message.authorId,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: userById(message.authorId).name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-ink-faint",
									children: where
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block truncate text-sm",
									children: snippet(message.body)
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mr-3 mt-3 shrink-0 rounded-md px-2 py-2 text-xs font-semibold text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
						onClick: () => useOrbit.getState().toggleSaved(message.id),
						children: "Remove"
					})]
				}, message.id);
			})
		})]
	});
}
function PaneHeader({ title, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 lg:px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Open navigation",
			onClick: () => useOrbit.getState().setNavOpen(true),
			className: "inline-flex size-11 items-center justify-center rounded-md lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-base font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-xs text-ink-faint",
				children: detail
			})]
		})]
	});
}
function Empty({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-1 items-center justify-center px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold text-balance",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-normal text-ink-soft",
				children: body
			})]
		})
	});
}
function SearchDialog({ messages }) {
	const open = useOrbit((state) => state.searchOpen);
	const workspaceId = useOrbit((state) => state.workspaceId);
	const extraConversations = useOrbit((state) => state.extraConversations);
	const extraWorkspaces = useOrbit((state) => state.extraWorkspaces);
	const conversations = conversationsOf(extraConversations).filter((item) => item.workspaceId === workspaceId);
	const workspace = workspacesOf(extraWorkspaces).find((item) => item.id === workspaceId);
	const people = USERS.filter((user) => conversations.some((conversation) => conversation.kind === "channel" ? conversation.memberIds.includes(user.id) : conversation.participantIds.includes(user.id)));
	const [query, setQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) setQuery("");
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Dialog, {
		open,
		onOpenChange: useOrbit.getState().setSearchOpen,
		label: "Search Orbit",
		vimBindings: false,
		overlayClassName: "fixed inset-0 z-40 bg-ink/40",
		contentClassName: "orbit-pop fixed inset-x-4 top-16 z-50 mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-line bg-paper-raised text-ink shadow-pop",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
			value: query,
			onValueChange: setQuery,
			placeholder: `Search ${workspace?.name ?? "Orbit"}`,
			className: "w-full border-b border-line bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink-faint"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
			className: "p-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
					className: "px-3 py-8 text-center text-sm text-ink-soft",
					children: "No matches for that search."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
					heading: "Channels",
					children: conversations.filter((conversation) => conversation.kind === "channel").map((conversation) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
						value: `channel ${conversation.kind === "channel" ? conversation.name : ""} ${conversation.kind === "channel" ? conversation.description : ""}`,
						onSelect: () => {
							useOrbit.getState().openConversation(conversation.id);
							useOrbit.getState().setSearchOpen(false);
						},
						className: "mt-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
							className: "size-4 text-ink-faint",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: conversation.kind === "channel" ? conversation.name : conversationTitle(conversation) })]
					}, conversation.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
					heading: "People",
					className: "mt-2",
					children: people.map((person) => {
						const dm = conversations.find((conversation) => conversation.kind === "dm" && !conversation.title && conversation.participantIds.includes(person.id)) ?? conversations.find((conversation) => conversation.kind === "dm" && conversation.participantIds.includes(person.id));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
							value: `person ${person.name} ${person.handle} ${person.title}`,
							onSelect: () => {
								if (dm) useOrbit.getState().openConversation(dm.id);
								else useOrbit.getState().setSearchOpen(false);
								useOrbit.getState().setSearchOpen(false);
							},
							className: "mt-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-ink",
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
									className: "text-ink-faint",
									children: person.title
								})
							]
						}, person.id);
					})
				}),
				query.trim().length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
					heading: "Messages",
					className: "mt-2",
					children: messages.filter((message) => conversations.some((conversation) => conversation.id === message.conversationId)).map((message) => {
						const conversation = conversations.find((item) => item.id === message.conversationId);
						const where = conversation ? conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation) : "Message";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
							value: `message ${message.body} ${userById(message.authorId).name} ${where}`,
							onSelect: () => {
								useOrbit.getState().focusMessage(message.id);
								useOrbit.getState().setSearchOpen(false);
							},
							className: "mt-1 flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-sm text-ink",
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
					})
				}) : null
			]
		})]
	});
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
		if (parentId) heading.current?.focus();
	}, [parentId]);
	if (!parentId) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"aria-label": "Thread",
		onKeyDown: (event) => {
			if (event.key === "Escape") {
				event.stopPropagation();
				close();
			}
		},
		className: "absolute inset-y-0 right-0 z-30 flex w-full min-h-0 flex-col bg-paper shadow-pop sm:w-thread xl:static xl:z-auto xl:shrink-0 xl:border-l xl:shadow-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						ref: heading,
						tabIndex: -1,
						className: "text-base font-semibold outline-none",
						children: "Thread"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-ink-faint",
						children: conversation ? conversation.kind === "channel" ? `#${conversationTitle(conversation)}` : conversationTitle(conversation) : "Conversation"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close thread",
					onClick: close,
					className: "inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:size-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-line px-4 py-4",
					children: parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							parent.authorId === "rowan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-ink-faint",
								children: "You"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
								dateTime: parent.createdAt,
								className: "text-xs text-ink-faint tabular-nums",
								children: timeLabel(parent.createdAt)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBody, { text: parent.body })
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
					conversationId: parent.conversationId,
					parentId: parent.id,
					placeholder: "Reply in thread"
				})
			}) : null
		]
	});
}
function OrbitApp() {
	(0, import_react.useEffect)(() => {
		useOrbit.getState().hydrate();
	}, []);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				useOrbit.getState().setSearchOpen(!useOrbit.getState().searchOpen);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitShell, {});
}
function OrbitShell() {
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
		className: "flex h-dvh overflow-hidden bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#conversation",
				className: "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2",
				children: "Skip to conversation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden h-full lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceRail, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden h-full w-sidebar-sm shrink-0 lg:block xl:w-sidebar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, { messages })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-0 min-w-0 flex-1",
				children: [
					view === "activity" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityView, { messages }) : null,
					view === "later" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaterView, { messages }) : null,
					view === "conversation" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationPane, { messages }) : null,
					view === "conversation" && threadParentId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close thread",
						className: "absolute inset-0 z-20 bg-ink/30 xl:hidden",
						onClick: () => useOrbit.getState().closeThread()
					}) : null,
					view === "conversation" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadPane, { messages }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNav, { messages }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, { messages }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitDialogs, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { position: "bottom-center" })
		]
	});
}
var SplitComponent = OrbitApp;
//#endregion
export { SplitComponent as component };
