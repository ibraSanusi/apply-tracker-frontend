import { ChevronRight, ClockFading } from "lucide-react";

interface ApplicationCard {
    id: number,
    company: string,
    position: string,
    status: string,
    appliedDate: Date
}

export default function ApplicationCard(application: ApplicationCard) {
    return (
        <article className="p-5 space-y-8">
            <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-1">
                    <h2 className="font-bold">{application.position}</h2>
                    <span className="text-xs text-slate-700">{application.company}</span>
                </div>

                <div className="h-full">
                    <span className="uppercase rounded-full bg-[#D5E3FC] text-slate-700 py-1 px-3 font-semibold text-[10px] leading-[0.5px]">
                        {application.status}
                    </span>
                </div>
            </div>

            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-3 items-center">
                    <ClockFading size={16} />
                    <span className="text-xs">{application.appliedDate.toDateString()}</span>
                </div>

                <a href={`/application/${application.id}`}>
                    <ChevronRight />
                </a>
            </div>
        </article>
    )
}