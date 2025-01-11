# Brainstorm

## Namespace

Nézz utána a namespacenek...

## Handshake (kézrázás) 🤝

A kapcsolat létrehozásánál a server <-> client egy kézrázást csinál, azaz üzenet ide-oda. Ennek attribútumait használhatjuk valamire? Elvileg nem. Ez csak ellenőrzésnek lesz jó.

## Munkamenet azonosító (egyedi)

Itt megadjuk majd az uuid.v4-est:

```javascript
io.engine.generateId = () => {
  return uuid.v4();
};
```

## SCENE váltás

Ahhoz, hogy a játékba ki tudjuk írni a kérdéseket, legyen lobby megilyenek, ahhoz kell sceneket váltani. Én arra gondoltam, ha lehet, akkor a react router dom-al megoldani... LEHETSÉGES?! - Meg kell nézni.

...megnéztem, lehetséges. Viszont létre kell hozni egy Socketkezelőt, hogy ne kapcsolódjon le a socketről. Ez annyit tenne ki, hogy létrehozunk egy contextet, és abba használjuk majd a pl: SocketProviderünket, ami annyi, hogy useRef-el eltároljuk a socketet, és ha nincs ilyen ref, akkor csatlakozunk.

A sceneket és a roomId-t pedig state-ben kezeljük, és akkor a scenek mint a layoutoknál lerendeljük külön komponensenként. Ezeknek akár lehet adni később transitionöket is.

## Szobák

Mivel egyszerre több mindenki is akarhat játszani, ezért külön szobákat kell létrehoznunk. Ezeknek lesz roomId-juk, ez uuid.v4() lesz. Létrehozunk egy random csatlakozási kódot is nekik. Ezt nem tudom, mivel lenne a legegyszerűbb, talán egy random számsorozat? Vagy egy számok és betűk összetétele? (U56HN). Lehessen QR kóddal is csatlakozni? Ha igen, akkor az hogy legyen megoldva, ha ilyen scene váltást szeretnénk csinálni? Legyen külön kezelve egy /room/id-s route?

A szobáknak külön class-t fogunk létrehozni, ez a legkönnyebb és adatbázishoz való tároláshoz is így lesz jó.

## Összefoglalás

Úgy lesz, hogy:

- `/c/room/quizId`: Itt lekérjük majd a quiz adatait és létrehozzuk a lobbyt egy PIN-el. Ilyenkor setState-el beállítjuk a hostot true-ra stb.
- Csatlakozni pedig `/code`-al lehet majd, és így lehet csatlakozni is a QR-kóddal. (qrcode | npm)

## Ideinglenes DB

- Quiz:
  - Quiz: quizId = uuid, name = text, lang = varchar(3)
  - Kérdés: questionId = int, quiz_id = int, question = TEXT
  - Válaszok: answerId = int, questionId = int, answer = varchar, correct = boolean