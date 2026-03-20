import React from "react";

interface ProfileScreenProps {
  name: string;
  weight: string;
  age: string;
  activeDays: number;
  exp: number;
  level: number;
  menusGenerated: number;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  name,
  weight,
  age,
  activeDays,
  exp,
  level,
  menusGenerated,
}) => {
  return (
    <div className="h-full overflow-y-auto p-4 pb-8 max-w-lg mx-auto w-full">
      <div className="app-card p-5 mb-5">
        <p className="app-muted-label mb-1">Conta</p>
        <h1 className="app-screen-title">Perfil</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Resumo da sua jornada (demonstração).</p>
      </div>

      <div className="space-y-2">
        {[
          ["Nome", name],
          ["Peso", weight],
          ["Idade", age],
          ["Dias ativos", `${activeDays} dias`],
          ["EXP", `${exp}`],
          ["Nível", `${level}`],
          ["Menus gerados", `${menusGenerated}`],
        ].map(([label, value]) => (
          <div key={label} className="app-card px-4 py-3 flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="text-foreground font-medium text-sm text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileScreen;
