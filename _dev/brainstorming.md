Nézz utána a namespacenek.

Talán azt lehet ezzel megcsinálni, hogy /game/<id> - azaz a game namespacebe lehet a külön játék szoba?
-> viszont hogy fogjuk áttenni egyik namespaceből a másikba a játékosokat? Ezt kéne kigondolni még!

-- HANDSHAKE (kézrázás)
Ugye a kapcsolat létrehozásánál csinál a server <-> client egy kézrázást, azaz üzenet ide-oda, ennek attributumait használhatjuk valamire? Elvileg nem. Ez csak ellenőrzésnek lesz jó.

-- Munkamenet azonosító (egyedi)
Itt mi megadjuk majd az uuid.v4-est 

io.engine.generateId = () => {
  return uuid.v4(); 
}

-- SZOBA
Egy paraméterezett ROUTE (/:code) -> res.render(room, {roomId: req.params.code}) ez lesz a létrehozott csatlakozó KÓD
-> ezt client oldalon lekezelni tudjuk mint beérkező variable ROOM_ID = ....

-- SZOBA JOIN
Ha lerendelődik a szoba, akkor egy emitelést küld a client a szervernek, pl. "Join-room" néven, itt a roomId-t és a userId-t visszküldjük,
majd ezek után socket joinulunk, illetve, a to(roomId)-val broadcast emitet küld a szerver oldal, hogy csatlakozott egy client.