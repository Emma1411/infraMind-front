import { createAction } from "@reduxjs/toolkit";

/** Efface tout : bouton « Réinitialiser » et nouvelle analyse depuis zéro. */
export const resetAll = createAction("app/resetAll");