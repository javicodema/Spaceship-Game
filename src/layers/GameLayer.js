class GameLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {
        reproducirMusica();
        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);

        this.puntos = new Texto(0,480*0.9,320*0.07 );

        this.vidas = new Texto(3,480*0.2,320*0.07 );
        this.fondoVida =
            new Fondo(imagenes.vida, 480*0.15,320*0.05);

        this.disparos = new Texto(0,480*0.5,320*0.07 );
        this.fondoDisparos =
            new Fondo(imagenes.bullet, 480*0.45,320*0.05);

        this.jugador = new Jugador(50, 50);
        this.fondo = new Fondo(imagenes.fondo,480*0.5,320*0.5);
        this.enemigos = [];
        this.enemigos.push(new Enemigo(300,50));
        this.enemigos.push(new Enemigo(350,200));
        this.disparosJugador = [];

        this.recolectables = [];

        this.powerups = [];

        this.bombas = [];
    }

    actualizar (){

        this.fondo.vx = -1;
        this.fondo.actualizar();
        this.disparos.valor=this.jugador.disparosLeft;

        console.log("disparosJugador: "+this.disparosJugador.length);
        // Eliminar disparos fuera de pantalla
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                !this.disparosJugador[i].estaEnPantalla()){

                this.disparosJugador.splice(i, 1);
            }
        }

        // Generar Enemigos
        if (this.iteracionesCrearEnemigos == null){
            this.iteracionesCrearEnemigos = 0;
        }
        // iteracionesCrearEnemigos tiene que ser un número
        this.iteracionesCrearEnemigos ++;

        if ( this.iteracionesCrearEnemigos > 110){
            var eX = Math.random() * (600 - 500) + 500;
            var eY = Math.random() * (300 - 60) + 60;
            var rX =(Math.random() *  480)+1;
            var rY = (Math.random() *  320)+1;

            this.enemigos.push(new Enemigo(eX,eY));
            if(this.recolectables.length<5) this.recolectables.push(new Recolectable(rX,rY));


            this.iteracionesCrearEnemigos = 0;
        }

        if (this.iteracionesCrearBomba == null){
            this.iteracionesCrearBomba = 0;
        }
        this.iteracionesCrearBomba ++;

        if(this.iteracionesCrearBomba>300&&this.bombas.length<2){
            var bX =(Math.random() *  480)+1;
            var bY = (Math.random() *  320)+1;
            this.bombas.push(new Bomba(bX,bY));
            this.iteracionesCrearBomba = 0;
        }

        if (this.iteracionesCrearPowerUp == null){
            this.iteracionesCrearPowerUp = 0;
        }
        this.iteracionesCrearPowerUp ++;

        if(this.iteracionesCrearPowerUp>200&&this.powerups.length<3){
            var pX =(Math.random() *  480)+1;
            var pY = (Math.random() *  320)+1;
            this.powerups.push(new PowerUp(pX,pY));
            this.iteracionesCrearPowerUp = 0;
        }



        this.jugador.actualizar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].actualizar(this.jugador.x, this.jugador.y);
        }
        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }

        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])&&this.jugador.vida<=0){
                this.iniciar();
            } else if(this.jugador.colisiona(this.enemigos[i])){
                this.enemigos.splice(i, 1);
                this.vidas.valor--;
                this.jugador.vida--;
            }
        }

        for (var i=0; i < this.recolectables.length; i++){
            this.recolectables[i].dibujar();
        }
        for (var i=0; i < this.recolectables.length; i++){
            if ( this.jugador.colisiona(this.recolectables[i])){
                this.recolectables.splice(i, 1);
                this.puntos.valor++;
            }
        }

        for (var i=0; i < this.powerups.length; i++){
            this.powerups[i].dibujar();
        }
        for (var i=0; i < this.powerups.length; i++){
            if ( this.jugador.colisiona(this.powerups[i])){
                this.powerups.splice(i, 1);
                this.jugador.disparosLeft+=10;
            }
        }

        for (var i=0; i < this.bombas.length; i++){
            this.bombas[i].dibujar();
        }
        for (var i=0; i < this.bombas.length; i++){
            if ( this.jugador.colisiona(this.bombas[i])){
                this.bombas.splice(i, 1);
                this.puntos.valor+=this.enemigos.length;
                this.enemigos = [];
            }
        }


        // colisiones , disparoJugador - Enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {

                    this.enemigos[j].vida--;
                    this.disparosJugador.splice(i, 1);
                    if(this.enemigos[j].vida<=0) {
                        this.enemigos.splice(j, 1);
                        this.jugador.disparosLeft++;
                        this.puntos.valor++;
                    }

                }
            }
        }


    }

    dibujar (){
        this.fondo.dibujar();
        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar();
        }

        this.jugador.dibujar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar();
        }

        for (var i=0; i < this.recolectables.length; i++){
            this.recolectables[i].dibujar();
        }

        for (var i=0; i < this.powerups.length; i++){
            this.powerups[i].dibujar();
        }

        for (var i=0; i < this.bombas.length; i++){
            this.bombas[i].dibujar();
        }


        this.fondoPuntos.dibujar();
        this.puntos.dibujar();
        this.fondoVida.dibujar();
        this.vidas.dibujar();
        this.fondoDisparos.dibujar();
        this.disparos.dibujar();
    }



    procesarControles( ){
        // disparar
        if (  controles.disparo ){
            var nuevoDisparo = this.jugador.disparar();
            if ( nuevoDisparo != null ) {
                this.disparosJugador.push(nuevoDisparo);
            }
        }


        // Eje X
        if ( controles.moverX > 0 ){
            this.jugador.moverX(1);

        }else if ( controles.moverX < 0){
            this.jugador.moverX(-1);

        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if ( controles.moverY > 0 ){
            this.jugador.moverY(-1);

        } else if ( controles.moverY < 0 ){
            this.jugador.moverY(1);

        } else {
            this.jugador.moverY(0);
        }

    }





}
