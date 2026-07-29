import { IkonBintang } from "./icons";
import { labelKesulitan } from "./format";

export default function BadgeKesulitan({ nilai, warna, t }) {
    if (!nilai) return null;
    const bintangPenuh = Math.round(nilai);

    return (
        <div
            className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${warna}15`, border: `1.5px solid ${warna}40` }}
        >
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <IkonBintang
                        key={i}
                        terisi={i <= bintangPenuh}
                        className="w-3.5 h-3.5"
                        style={{ color: i <= bintangPenuh ? warna : "#D1D5DB" }}
                    />
                ))}
            </div>
            <span className="text-xs font-semibold" style={{ color: warna }}>
                {labelKesulitan(nilai, t)}
            </span>
        </div>
    );
}