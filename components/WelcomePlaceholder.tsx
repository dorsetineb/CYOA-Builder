
import React from 'react';

export const WelcomePlaceholder: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-dim p-8 bg-brand-surface">
            <h2 className="text-2xl font-bold text-brand-text mb-2">Bem-vindo ao CYOA Builder!</h2>
            <p className="max-w-md">
                Selecione uma cena à esquerda para começar a editar, ou adicione uma nova cena para expandir seu mundo.
            </p>
        </div>
    );
};