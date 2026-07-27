import { IkonUsia } from "./icons";

export default function BadgeUsia({ usia, t }) {
    if (!usia) return null;
    return (
        <div className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-800 text-white">
            <IkonUsia className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{usia} {t.usia}</span>
        </div>
    );
}