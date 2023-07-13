import { BehaviorSubject } from 'rxjs'
import { GameplayUIState } from '../Gameplay/GameplayUIState'

export class GameplayUIPod {
   public currentGameplayUIState: BehaviorSubject<GameplayUIState> = new BehaviorSubject<GameplayUIState>(
      GameplayUIState.Gameplay
   )

   public changeGameplayUIState(state: GameplayUIState): void {
      this.currentGameplayUIState.next(state)
   }
}
