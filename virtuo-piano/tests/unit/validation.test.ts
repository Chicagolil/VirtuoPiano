import { describe, it, expect } from 'vitest';

// Fonctions de validation (à adapter selon votre implémentation)
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

const validateUsername = (username: string): boolean => {
  // Entre 3 et 20 caractères, lettres, chiffres et underscores uniquement
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

describe('Validation des entrées utilisateur', () => {
  describe('validateEmail', () => {
    it('devrait accepter des emails valides', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('devrait rejeter des emails invalides', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('devrait accepter des mots de passe valides', () => {
      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('Abc12345')).toBe(true);
      expect(validatePassword('SecurePass1')).toBe(true);
    });

    it('devrait rejeter des mots de passe invalides', () => {
      expect(validatePassword('password')).toBe(false); // Pas de majuscule
      expect(validatePassword('PASSWORD')).toBe(false); // Pas de minuscule
      expect(validatePassword('Pass')).toBe(false); // Trop court
      expect(validatePassword('Password')).toBe(false); // Pas de chiffre
    });
  });

  describe('validateUsername', () => {
    it("devrait accepter des noms d'utilisateur valides", () => {
      expect(validateUsername('john_doe')).toBe(true);
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('jane_doe_123')).toBe(true);
    });

    it("devrait rejeter des noms d'utilisateur invalides", () => {
      expect(validateUsername('jo')).toBe(false); // Trop court
      expect(validateUsername('a'.repeat(21))).toBe(false); // Trop long
      expect(validateUsername('user@name')).toBe(false); // Caractères spéciaux non autorisés
      expect(validateUsername('user name')).toBe(false); // Espace non autorisé
    });
  });
});
