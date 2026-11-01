# AGENTS.md - BoloTodo | Senior Agent Guide

> Agent Instruction: Tum ek Senior React Native Engineer ho (5+ years). Is file ko poora parh ke hi kaam start karna. Code likhne se pehle sochna ki ek senior kya karta.

## 1. Project Overview
BoloTodo ek offline-first voice-to-todo app hai.
User Roman Urdu me bolega "mujhe kal subha 9 baje gym jana hai" -> Whisper transcribe karega -> Ollama Gemma usko English todo + date me convert karega -> MobX store + SQLite me save + alarm lagayega.

Goal: 2 second ke andar voice se todo, 60fps animation, offline STT.

## 2. Tech Stack - Har Tech Kyun Use Ho Rahi Hai

- **Expo SDK 52+:** Base framework.
- **whisper.rn:** Voice to Text. Sab se accurate Roman Urdu ke liye. Offline chalta hai. react-native-voice mat use karna.
- **Ollama (gemma3:2b cloud):** AI brain. Urdu ko English + JSON me convert karne ke liye. Server pe host hoga, mobile pe nahi.
- **TanStack Query v5:** Saare server calls (Ollama API) ke liye. Loading, caching, retry isi se.
- **MobX-State-Tree:** Local state (todos, mic state). Reactive hai, FlatList khud update ho jata hai.
- **Reanimated 3 + Moti:** Sari animations UI thread pe. Mic wave, card entry.
- **React Native Reusables (rnr.new):** Ready-made UI components (Button, Card, BottomSheet).
- **expo-sqlite + drizzle-orm:** Todos ko permanently save karne ke liye.
- **expo-notifications + expo-intent-launcher:** Alarm ke liye. iOS pe notification, Android pe native clock + notification.

## 3. Project Structure - Senior Level

```
/app
  /_layout.tsx                 -> Root layout, providers (MobX, TanStack, RNR theme)
  /(tabs)/
    /index.tsx                 -> Home screen, sirf orchestration karega, logic nahi
    /settings.tsx              -> Ollama URL, model download status

/components
  /ui/                         -> RNR se aye hue components, yahan change mat karna
  /MicButton/                  -> Apna folder
    /MicButton.tsx             -> Sirf UI, 80 line se zyada nahi
    /Waveform.tsx              -> Alag component, Reanimated wave logic
    /index.ts                  -> Export
  /TodoCard/
    /TodoCard.tsx              -> Sirf ek todo dikhana
    /TodoCardActions.tsx       -> Edit, delete buttons alag
  /EmptyState.tsx
  /ModelDownloadProgress.tsx

/lib
  /whisper/                    -> Whisper ka sara logic yahan
    /manager.ts                -> Model download check, init, singleton
    /transcribe.ts             -> Audio uri se text nikalna
  /ollama/
    /client.ts                 -> Ollama API call logic
    /prompt.ts                 -> System prompt aur schema definition
    /validator.ts              -> Response validation
  /alarm/
    /permissions.ts            -> Notification permission
    /scheduler.ts              -> Alarm schedule logic
  /audio/
    /recorder.ts               -> expo-audio ka wrapper hook

/store
  /RootStore.ts                -> Saare stores ka root
  /TodosStore.ts               -> Todos ka MST store
  /UIStore.ts                  -> Mic recording, loading states

/hooks
  /useBoloTodo.ts              -> Sab se important, saare steps ko jorne wala hook
  /usePermissions.ts

/utils
  /date.ts                     -> "kal", "parson", "agle jumme" ko date me convert
  /constants.ts
```

**Structure ka Rule:** Har folder ka kaam alag. `lib` me kabhi UI logic nahi, `components` me kabhi API call nahi.

## 4. Senior Best Practices - Lazmi Follow Karo

### A. File Size Rule (200 Line Rule)
- Agar koi file 200 lines se zyada ho jaye to usko foran todo. Naya component, naya hook, ya naya lib file banao.
- Ek component ideally 60-100 lines ka ho. 150 se upar jaye to samjho galat ja raha hai.
- Example: Agar `index.tsx` 250 lines ka ho gaya hai to usme se `MicButton` aur `TodoList` alag components me nikalo.

### B. Ponytail Rule (Clean Tail Rule)
Iska matlab hai har file ki tail (end) saaf honi chahiye. Neeche 3 cheezen follow karo:
1.  **Lean Head, Thin Tail:** Component ka upar wala hissa (head) sirf state aur hooks, neeche wala hissa (tail) sirf JSX. Beech me logic mat bharo. Logic ko `hooks` ya `lib` me bhejo.
2.  **No Heavy Tail:** File ke end me kabhi bhi bade helper functions mat rakho. Helper ko `utils` me daalo.
3.  **One File One Work:** Ek file ek hi kaam kare. Agar MicButton.tsx me recording + transcription + alarm teenon hai to ye ponytail rule ke khilaf hai. Har kaam alag file me.

### C. Component Best Practices
- Single Responsibility: Ek component ek hi kaam kare.
- Props drilling 2 level se zyada nahi. Agar 3 level ja raha hai to MobX store use karo.
- Reusable banao: TodoCard ko aisa banao ki wo kahin bhi use ho sake, usme store ka direct use mat karo, props se data lo.
- Observer pattern: Jo component store ka data parh raha hai usko `observer` se wrap karo.

### D. Code Quality Rules
- TypeScript strict, `any` bilkul mana hai. Har cheez ka type define karo.
- Saare async kaam (Whisper, Ollama, Alarm) me proper try/catch aur error states.
- Reanimated ka kaam hamesha UI thread pe. `useSharedValue` aur worklets use karo, `setState` se animation mat karo.
- TanStack Query keys hamesha array me aur constants se: `['todos', 'parse']`.
- MobX me state change hamesha action ke andar.

### E. Performance & Offline
- App offline pehle socho. Voice to text offline hona chahiye. Todos SQLite me hone chahiye. Sirf Ollama online hai.
- Agar internet nahi hai to raw Urdu text ko `needs_parsing: true` ke sath save karo, net aate hi background me parse karo.
- FlashList use karo agar list lambi hai, FlatList ka `getItemLayout` lazmi do.

### F. Naming & Git
- File names: PascalCase for components (TodoCard.tsx), camelCase for hooks (useBoloTodo.ts).
- Commit messages: `feat: add whisper transcription`, `fix: alarm permission issue`.
- Ek commit me ek hi feature.

## 5. App Flow - Agent Ke Liye Samjhao

1.  **Mic Press:** User MicButton dabata hai -> Waveform animation start (Reanimated).
2.  **Record:** expo-audio 16kHz mono wav record karta hai.
3.  **Transcribe:** whisper.rn wav ko Roman Urdu text me badalta hai.
4.  **Parse:** TanStack mutation se text Ollama server pe jata hai, wahan se JSON aata hai: English title, Urdu title, ISO date, alarm chahiye ya nahi, category.
5.  **Save:** MobX store me add, SQLite me persist.
6.  **Alarm:** Agar date hai to notification schedule + Android pe native clock intent.
7.  **UI Update:** MobX ki wajah se list khud update, Moti se naya card animate.

## 6. Agent Ka Kaam Karne Ka Tareeka (Step by Step)

Step 1: Expo + NativeWind + RNR + Reanimated + Moti setup karo.
Step 2: Folder structure banao jaisa upar diya hai, khali files.
Step 3: MobX stores + SQLite setup, manual todo add karke test karo.
Step 4: expo-audio se recording + MicButton animation.
Step 5: whisper.rn ka manager banao, model download ka progress UI dikhao.
Step 6: Ollama client + TanStack Query mutation joro.
Step 7: useBoloTodo orchestrator banao jo saare steps jorta hai.
Step 8: Alarm permissions + scheduler.
Step 9: Polish: Empty states, error toasts, 200 line rule check.

## 7. DOs and DON'Ts

**DOs:**
- Har naya feature se pehle folder structure check karo.
- 200 line rule ka khayal rakho.
- Ponytail rule follow karo - lean components.
- Har hook aur lib ka alag test socho.

**DON'Ts:**
- DON'T use @react-native-voice/voice.
- DON'T use expo-av (deprecated).
- DON'T use Animated API from react-native.
- DON'T put business logic inside components.
- DON'T make one file >200 lines.
- DON'T hardcode Ollama URL, .env se lo.

## 8. Final Checklist (Senior Review)

- [ ] Koi file 200 lines se zyada to nahi?
- [ ] Har component ka ek hi kaam hai?
- [ ] Recording 16kHz mono hai?
- [ ] Whisper model singleton hai, baar baar init nahi ho raha?
- [ ] Ollama response Zod se validate ho raha hai?
- [ ] Offline me app crash to nahi karta?
- [ ] Animations UI thread pe hain?
- [ ] Todos app kill ke baad bhi rehte hain?

Ye checklist pass ho to hi PR ready samjho.
