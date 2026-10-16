import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRound, LockKeyhole, ArrowRight } from "lucide-react";
import { login } from "@/lib/auth/login";

export function LoginForm() {
  return (
    <form action={login} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-ink-300">
          E-mail
        </span>
        <div className="relative">
          <UserRound
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
          />
          <Input
            name="login"
            type="email"
            required
            className="input !pl-10"
            placeholder="voce@empresa.com"
            autoComplete="username"
          />
        </div>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-ink-300">
          Senha
        </span>
        <div className="relative">
          <LockKeyhole
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
          />
          <Input
            name="password"
            type="password"
            required
            className="input !pl-10"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
      </label>
      <Button
        variant="unstyled"
        type="submit"
        className="btn btn-primary w-full !py-3.5 text-[15px]"
      >
        Entrar
        <ArrowRight size={17} strokeWidth={2.5} />
      </Button>
    </form>
  );
}
