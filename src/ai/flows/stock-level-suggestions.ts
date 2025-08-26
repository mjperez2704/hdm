'use server';

/**
 * @fileOverview AI-driven stock level suggestions based on historical movement data.
 *
 * - suggestStockLevels - A function that suggests optimal stock levels for each location.
 * - SuggestStockLevelsInput - The input type for the suggestStockLevels function.
 * - SuggestStockLevelsOutput - The return type for the suggestStockLevels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStockLevelsInputSchema = z.object({
  location: z.string().describe('La ubicación para la que se sugieren los niveles de stock.'),
  objectType: z.string().describe('El tipo de objeto (por ejemplo, parte, accesorio, SIM, equipo).'),
  historicalData: z.string().describe('Datos históricos de movimientos de stock, como una cadena de texto.'),
});
export type SuggestStockLevelsInput = z.infer<typeof SuggestStockLevelsInputSchema>;

const SuggestStockLevelsOutputSchema = z.object({
  suggestedLevel: z
    .number()
    .describe('El nivel de stock óptimo sugerido para la ubicación.'),
  reasoning: z
    .string()
    .describe('El razonamiento detrás del nivel de stock sugerido.'),
});
export type SuggestStockLevelsOutput = z.infer<typeof SuggestStockLevelsOutputSchema>;

export async function suggestStockLevels(
  input: SuggestStockLevelsInput
): Promise<SuggestStockLevelsOutput> {
  return suggestStockLevelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStockLevelsPrompt',
  input: {schema: SuggestStockLevelsInputSchema},
  output: {schema: SuggestStockLevelsOutputSchema},
  prompt: `Eres un experto en gestión de inventario. Analiza los datos históricos de movimiento de stock para la siguiente ubicación y tipo de objeto para sugerir un nivel de stock óptimo.

Ubicación: {{location}}
Tipo de objeto: {{objectType}}
Datos Históricos: {{historicalData}}

Basado en estos datos, ¿cuál es el nivel de stock óptimo para minimizar la escasez y el exceso de existencias? Explica tu razonamiento.
`,
});

const suggestStockLevelsFlow = ai.defineFlow(
  {
    name: 'suggestStockLevelsFlow',
    inputSchema: SuggestStockLevelsInputSchema,
    outputSchema: SuggestStockLevelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
