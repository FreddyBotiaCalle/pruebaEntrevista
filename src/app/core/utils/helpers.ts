/**
 * Utilidades generales para la aplicación
 */

/**
 * Generar ID único
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncar texto
 */
export function truncateText(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
}

/**
 * Formatear fecha
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('es-ES');
    case 'long':
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'time':
      return dateObj.toLocaleTimeString('es-ES');
    default:
      return dateObj.toLocaleDateString('es-ES');
  }
}

/**
 * Validar si una cadena está vacía
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Deep clone de objeto
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Delay en milisegundos
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Detectar si está en navegador
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Detectar si está en dispositivo móvil
 */
export function isMobileDevice(): boolean {
  if (!isBrowser()) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
