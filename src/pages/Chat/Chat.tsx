import Header from "../../components/Header";
import SearchInput from "../../components/SearchInput.tsx";
import ApplicationCard from "../../components/ApplicationCard.tsx";


export default function Chat() {
    return (
        <div>
            <Header />
            <main className="px-6 py-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold">Applications</h1>
                    <p className="text-slate-700">Track your progress and upcoming interviews.</p>
                </div>

                <SearchInput />

                <ApplicationCard id={1} position="Product Manager" company="Stripe" appliedDate={new Date()} status="sent" />
            </main>
        </div>
    );
}