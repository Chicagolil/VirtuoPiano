import { z } from 'zod';

// Schéma de base pour les données utilisateur
const userDataSchema = {
  email: z
    .string()
    .min(1, "L'email est requis")
    .email('Adresse email invalide')
    .max(100, "L'email ne peut pas dépasser 100 caractères"),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  userName: z
    .string()
    .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères")
    .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores"
    ),
};

// Schéma pour l'inscription (tous les champs requis)
export const registerSchema = z.object({
  ...userDataSchema,
  privacyConsent: z.boolean().refine((val) => val === true, {
    message:
      'Vous devez accepter la politique de confidentialité pour continuer',
  }),
});

// Schéma pour la mise à jour du consentement
export const updatePrivacyConsentSchema = z.object({
  email: userDataSchema.email,
  password: z.string().min(1, 'Le mot de passe est requis'),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message:
      'Vous devez accepter la politique de confidentialité pour continuer',
  }),
});

// Schéma pour la rectification des données (même validation que l'inscription mais champs optionnels)
export const rectificationSchema = z.object({
  userName: userDataSchema.userName.optional(),
  email: userDataSchema.email.optional(),
  currentPassword: z
    .string()
    .min(1, 'Le mot de passe actuel est requis')
    .optional(),
  newPassword: userDataSchema.password.optional(),
  resetLevel: z.boolean().optional(),
});

// Types TypeScript dérivés des schémas
export type RegisterData = z.infer<typeof registerSchema>;
export type UpdatePrivacyConsentData = z.infer<
  typeof updatePrivacyConsentSchema
>;
export type RectificationData = z.infer<typeof rectificationSchema>;
