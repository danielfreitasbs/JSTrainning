
//INCORRECT OBSERVER IMPLEMENTATION - BEGIN
// interface TemperatureSensor {
//     getTemperature(): Number;
// }

// class ArduinoTemperatureSensor implements TemperatureSensor {
//     protected temperature: Number = 0;

//     constructor() {
//         setInterval(this.setNewTemperature.bind(this), 2000);
//     }

//     getTemperature(): Number {
//         return this.temperature;
//     }

//     protected setNewTemperature() {
//         const randomTemperature = Math.floor(Math.random() * 120);
//         console.info(`New temperature: ${randomTemperature}`);
//         this.setTemperature(Math.floor(randomTemperature));
//     }

//     protected setTemperature(temperature: Number) {
//         this.temperature = temperature;
//     }
// }

// class Fan {
//     protected temperatureSensor: TemperatureSensor;
//     protected running: boolean = false;

//     constructor(temperatureSensor: TemperatureSensor) {
//         this.temperatureSensor = temperatureSensor;
//         setInterval(this.monitorTemperature.bind(this), 100);
//     }

//     public update(temperature: Number) {
//         console.info(`Fan red temperature ${temperature}`);
//         if (temperature < 50) {
//             return this.turnOff();
//         }

//         return this.turnOn();
//     }

//     protected monitorTemperature() {
//         const temperature = this.temperatureSensor.getTemperature();
//         this.update(temperature);
//     }

//     protected turnOn() {
//         if (!this.running) {
//             this.running = true;
//             console.info('Fan started');
//         }
//     }

//     protected turnOff() {
//         if (this.running) {
//             this.running = false;
//             console.info('Fan stopped');
//         }
//     }
// }

// class TemperatureDisplay {
//     protected readonly temperatureSensor: TemperatureSensor;

//     constructor(temperatureSensor: TemperatureSensor) {
//         this.temperatureSensor = temperatureSensor;
//         setInterval(this.monitorTemperature.bind(this), 100);
//     }

//     public update(temperature: Number) {
//         console.info(`Display: ${temperature}`);
//     }

//     protected monitorTemperature() {
//         const temperature = this.temperatureSensor.getTemperature();
//         this.update(temperature);
//     }
// }

// const arduinoTemperatureSensor = new ArduinoTemperatureSensor();
// const fan = new Fan(arduinoTemperatureSensor);
// const temperatureDisplay = new TemperatureDisplay(arduinoTemperatureSensor);

//INCORRECT OBSERVER IMPLEMENTATION - END

//ENCONTRADO EM: https://meneguite.com/2019/06/23/design-patterns-com-typescript-observer/

//CORRECT OBESERVER IMPLEMENTATION - BEGIN
interface Observer {
    notify(temperature: Number): void;
}

interface Subject {
    registerObserver(observer: Observer): void;
    unregisterObserver(observer: Observer): void;
    notifyObservers(): void;
}

interface TemperatureSensor extends Subject {
    getTemperature(): Number;
}

class ArduinoTemperatureSensor implements TemperatureSensor {

    protected temperature: Number = 0;
    protected observers: Observer[] = [];

    constructor() {
        setInterval(this.setNewTemperature.bind(this), 2000);
    }

    protected setNewTemperature() {
        const randomTemperature = Math.floor(Math.random() * 120);
        console.info(`New Temperature: ${randomTemperature}`);
        this.setTemperature(Math.floor(randomTemperature));
    }

    protected setTemperature(temperature: Number) {
        this.temperature = temperature;
        this.notifyObservers();
    }

    getTemperature(): Number {
        throw new Error("Method not implemented.");
    }
    registerObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    unregisterObserver(observer: Observer): void {
        this.observers = this.observers.filter(o => o !== observer);
    }
    notifyObservers(): void {
        this.observers.forEach((observer) => observer.notify(this.getTemperature()));
    }

}

class Fan implements Observer {
    protected temperatureSubject: Subject;
    protected running: boolean = false;

    constructor(temperatureSubject: Subject) {
        this.temperatureSubject = temperatureSubject;
        this.temperatureSubject.registerObserver(this);
    }

    public notify(temperature: Number) {
        console.info(`Fan read temperature ${temperature}`);
        if (temperature < 50) {
            return this.turnOff();
        }

        return this.turnOn();
    }

    protected turnOn() {
        if (!this.running) {
            this.running = true;
            console.info('Fan started');
        }
    }

    protected turnOff() {
        if (this.running) {
            this.running = false;
            console.info('Fan stoped');
        }
    }
}

class TemperatureDisplay implements Observer {
    protected readonly temperatureSubject: Subject;

    constructor(temperatureSubject: Subject) {
        this.temperatureSubject = temperatureSubject;
        this.temperatureSubject.registerObserver(this);
    }

    public notify(temperature: Number) {
        console.info(`Display: ${temperature}`);
    }
}

const arduinoTemperatureSensor = new ArduinoTemperatureSensor();
const fan = new Fan(arduinoTemperatureSensor);
const temperatureDisplay = new TemperatureDisplay(arduinoTemperatureSensor);


//CORRECT OBESERVER IMPLEMENTATION - END
