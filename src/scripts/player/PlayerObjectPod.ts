import { BehaviorSubject } from 'rxjs'

export class PlayerObjectPod {
   public isOnLeftSide: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

   public playerHp: BehaviorSubject<number> = new BehaviorSubject<number>(3)

   public score: number = 0

   public changeSide(isLeftSide: boolean): void {
      this.isOnLeftSide.next(isLeftSide)
   }

   public decreaseHP(): void {
      this.playerHp.next(this.playerHp.getValue() - 1)
   }

   public increasePlayerScore(): void {
      this.score++
   }

   public getPlayerScore(): number {
      return this.score
   }
}
