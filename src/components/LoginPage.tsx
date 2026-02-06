"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";

export const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-cyan-500/20 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping mb-2" />
          <h2 className="text-3xl font-black text-cyan-400 tracking-tighter uppercase italic">
            DocuPulse Access
          </h2>
          <p className="text-[10px] text-cyan-900 font-black uppercase tracking-[0.3em] mt-2">
            Järjestelmän alustus vaaditaan
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#22d3ee",
                  brandAccent: "#0891b2",
                  inputText: "white",
                  inputBackground: "rgba(0,0,0,0.3)",
                  inputBorder: "rgba(34,211,238,0.2)",
                  inputLabelText: "#64748b",
                },
              },
            },
          }}
          providers={["google"]}
          onlyThirdPartyProviders={true}
          theme="dark"
          localization={{
            variables: {
              sign_in: {
                button_label: "KÄYNNISTÄ_ISTUNTO",
              },
            },
          }}
        />

        <div className="mt-8 text-center">
          <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest italic">
            Secure_Terminal_v2.0.26
          </p>
        </div>
      </div>
    </div>
  );
};
