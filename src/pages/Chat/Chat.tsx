import Header from "../../components/Header";
import SearchInput from "../../components/SearchInput.tsx";

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
            </main>
        </div>
    );
}