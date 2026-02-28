import type { MealPlan } from './MealPlanGenerator';

export class ShoppingListManager {
  //holds all the meals for the day
  private weeklyPlans: MealPlan[] = [];

  //adds days to the day list
  addDayToPlan(plan: MealPlan): void {
    this.weeklyPlans.push(plan);
  }

  //generates the big shopping list
  generateFinalShoppingList(): string[] {
   
    const counter = new Map<string, number>();

    const allIngredients = this.weeklyPlans.flatMap(day => [
      ...day.breakfast.ingredients,
      ...day.lunch.ingredients,
      ...day.dinner.ingredients,
      ...day.snack.ingredients
    ]);

   //combines all the ingredients and counts duplicates
    allIngredients.forEach(item => {
      const name = item.trim(); 
      const currentAmount = counter.get(name) || 0;
      
      
      counter.set(name, currentAmount + 1);
    });

    // we turn our "Counter" back into a readable list for the user.
    return Array.from(counter.entries()).map(([name, count]) => {
      // if we have more than one, we show "2x", otherwise just the name.
      return count > 1 ? `${count}x ${name}` : name;
    });
  }

  //clear
  clearPlan(): void {
    this.weeklyPlans = [];
  }
  getPlanCount(): number {
  return this.weeklyPlans.length;
}
}
