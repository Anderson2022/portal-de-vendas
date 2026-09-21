import { CircleAlert, Inbox } from "lucide-react";
export function FinancialState({ title, description, error = false }: {
    title: string;
    description: string;
    error?: boolean;
}) {
    const Icon = error ? CircleAlert : Inbox;
    return <div className="fin-panel py-12 text-center" role={error ? "alert" : "status"}><Icon className="mx-auto mb-4 fin-muted" size={32}/><h2 className="font-bold">{title}</h2><p className="fin-muted mx-auto mt-2 max-w-xl text-sm">{description}</p></div>;
}
