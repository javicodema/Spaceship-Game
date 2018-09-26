class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador, x, y)
        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY

        this.cadenciaDisparo = 30;
        this.tiempoDisparo = 0;
        this.disparosLeft=5;
        this.vida=3;
    }

    disparar(){
        if ( this.tiempoDisparo == 0 && this.disparosLeft>0) {
            // reiniciar Cadencia
            this.tiempoDisparo = this.cadenciaDisparo;
            this.disparosLeft--;
            return new DisparoJugador(this.x, this.y);
        } else {
            return null;
        }

    }


    actualizar() {
        // Tiempo Disparo
        if ( this.tiempoDisparo > 0 ) {
            this.tiempoDisparo--;
        }


        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }

    moverX(direccion) {
        this.vx = direccion * 3;
    }

    moverY(direccion) {
        this.vy = direccion * 3;
    }


}
