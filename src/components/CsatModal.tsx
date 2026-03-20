import React, { useState } from 'react';
import { X, Star, Send, CheckCircle } from 'lucide-react';

interface CsatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  planId?: string;
}

const CsatModal: React.FC<CsatModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit(rating, feedback);
    setIsSubmitted(true);
    setIsSubmitting(false);
    setTimeout(() => onClose(), 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const getRatingLabel = (value: number): string => {
    switch (value) {
      case 1:
        return 'Muito insatisfeito';
      case 2:
        return 'Insatisfeito';
      case 3:
        return 'Neutro';
      case 4:
        return 'Satisfeito';
      case 5:
        return 'Muito satisfeito';
      default:
        return 'Selecione uma nota';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" onClick={handleClose} aria-hidden />

      <div className="relative app-card w-full max-w-md overflow-hidden shadow-lg">
        <div className="bg-primary px-5 pt-8 pb-6 relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 text-primary-foreground/80 hover:text-primary-foreground p-1 rounded-md transition-colors"
            disabled={isSubmitting}
            aria-label="Fechar"
          >
            <X size={22} strokeWidth={2} />
          </button>

          <div className="text-center pr-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-foreground/15 rounded-lg mb-3">
              {isSubmitted ? (
                <CheckCircle size={28} className="text-primary-foreground" strokeWidth={2} />
              ) : (
                <Star size={28} className="text-primary-foreground" strokeWidth={2} />
              )}
            </div>
            <h2 className="text-lg font-semibold text-primary-foreground tracking-tight">
              {isSubmitted ? 'Obrigado' : 'Sua opinião importa'}
            </h2>
            <p className="text-primary-foreground/85 text-sm mt-2 leading-relaxed">
              {isSubmitted
                ? 'Seu feedback foi registrado.'
                : 'Como você avalia sua experiência com o menu alimentar?'}
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="p-5">
            <div className="flex flex-col items-center mb-6">
              <div className="flex gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={isSubmitting}
                  >
                    <Star
                      size={36}
                      strokeWidth={1.5}
                      className={`transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'fill-primary text-primary'
                          : 'fill-muted text-muted-foreground/35'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="h-7 flex items-center justify-center">
                {(hoveredRating || rating) > 0 ? (
                  <span className="text-sm font-medium text-foreground">{getRatingLabel(hoveredRating || rating)}</span>
                ) : (
                  <span className="text-muted-foreground text-xs">Toque nas estrelas para avaliar</span>
                )}
              </div>
            </div>

            <div className="mb-5">
              <label className="block app-muted-label mb-2 normal-case tracking-normal font-medium text-foreground">
                Comentário (opcional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="O que achou do seu plano? Alguma sugestão?"
                className="w-full px-3 py-2.5 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm text-foreground placeholder:text-muted-foreground bg-card"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-opacity ${
                rating === 0 || isSubmitting
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  <Send size={18} strokeWidth={2} />
                  Enviar avaliação
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full mt-3 py-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              Pular avaliação
            </button>
          </div>
        ) : (
          <div className="p-5 text-center">
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">Sua avaliação nos ajuda a melhorar o serviço.</p>
            <div className="flex justify-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={22}
                  strokeWidth={1.5}
                  className={
                    star <= rating ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground/35'
                  }
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{getRatingLabel(rating)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsatModal;
