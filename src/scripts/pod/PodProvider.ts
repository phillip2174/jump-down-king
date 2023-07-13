import { LazyGetter } from 'lazy-get-decorator'
import { GameplayPod } from './GameplayPod'
import { GameplayUIPod } from './GameplayUIPod'

export class PodProvider {
   private static _instance: PodProvider

   private static getInstance() {
      if (!PodProvider._instance) {
         PodProvider._instance = new PodProvider()
      }
      return PodProvider._instance
   }

   static get instance(): PodProvider {
      return this.getInstance()
   }

   @LazyGetter()
   get gamePlayPod(): GameplayPod {
      return new GameplayPod()
   }

   @LazyGetter()
   get gamePlayUIPod(): GameplayUIPod {
      return new GameplayUIPod()
   }
}
