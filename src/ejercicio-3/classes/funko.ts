import { FunkoTypes } from "../enums/funko_types.js";
import { FunkoGenres } from "../enums/funko_genres.js";

export class Funko {
  /**
   * Constructor of the class Funko
   * @param _id ID of the Funko. Must be a positive integer
   * @param _name Name of the Funko
   * @param _description Description of the Funko
   * @param _type Type of the Funko
   * @param _genre Genre of the Funko
   * @param _franchise Franchise of the Funko
   * @param _number Number of the Funko. Must be a positive integer
   * @param _exclusive Exclusiveness of the Funko
   * @param _characteristics Special characteristics of the Funko
   * @param _value Market value of the Funko. Must be a positive number
   */
  constructor(
    private _id: number,
    private _name: string,
    private _description: string,
    private _type: FunkoTypes,
    private _genre: FunkoGenres,
    private _franchise: string,
    private _number: number,
    private _exclusive: boolean,
    private _characteristics: string,
    private _value: number
  ) {
    if (_id % 1 !== 0 || _id < 0) {
      throw new Error("El ID de un Funko debe ser un entero positivo");
    }
    if (_number % 1 !== 0 || _number < 0) {
      throw new Error(
        "El número identificativo de un Funko debe ser un entero positivo"
      );
    }
    if (_value < 0) {
      throw new Error("El valor de mercado de un Funko debe ser positivo");
    }
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    if (id % 1 !== 0 || id < 0) {
      throw new Error("El ID de un Funko debe ser un entero positivo");
    }
    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  get type(): FunkoTypes {
    return this._type;
  }

  set type(type: FunkoTypes) {
    this._type = type;
  }

  get genre(): FunkoGenres {
    return this._genre;
  }

  set genre(genre: FunkoGenres) {
    this._genre = genre;
  }

  get franchise(): string {
    return this._franchise;
  }

  set franchise(franchise: string) {
    this._franchise = franchise;
  }

  get number(): number {
    return this._number;
  }

  set number(number: number) {
    if (number % 1 !== 0 || number < 0) {
      throw new Error(
        "El número identificativo de un Funko debe ser un entero positivo"
      );
    }
    this._number = number;
  }

  get exclusive(): boolean {
    return this._exclusive;
  }

  set exclusive(exclusive: boolean) {
    this._exclusive = exclusive;
  }

  get characteristics(): string {
    return this._characteristics;
  }

  set characteristics(characteristics: string) {
    this._characteristics = characteristics;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (value < 0) {
      throw new Error("El valor de mercado de un Funko debe ser positivo");
    }
    this._value = value;
  }

  /**
   * Creates a Funko from a string array with the parameters of the Funko
   * @param text String array with the Funko's parameters
   * @returns A new Funko with the atributes defined
   */
  public static instanceFromParams(params: string[]): Funko {
    let type: FunkoTypes;
    switch (params[3].toLowerCase()) {
      case "pop!":
        type = FunkoTypes.POP;
        break;
      case "pop! rides":
        type = FunkoTypes.POP_RIDES;
        break;
      case "vynil soda":
        type = FunkoTypes.VYNIL_SODA;
        break;
      case "vynil gold":
        type = FunkoTypes.VYNIL_GOLD;
        break;
      default:
        throw new Error(
          "El tipo del Funko debe ser Pop!, Pop! Rides, Vynil Soda o Vynil Gold"
        );
    }
    let genre: FunkoGenres;
    switch (params[4].toLowerCase()) {
      case "animación":
        genre = FunkoGenres.ANIMATION;
        break;
      case "anime":
        genre = FunkoGenres.ANIME;
        break;
      case "películas y tv":
        genre = FunkoGenres.MOVIES_AND_TV;
        break;
      case "música":
        genre = FunkoGenres.MUSIC;
        break;
      case "deportes":
        genre = FunkoGenres.SPORTS;
        break;
      case "videojuegos":
        genre = FunkoGenres.VIDEOGAMES;
        break;
      default:
        throw new Error(
          "El género del Funko debe ser Animación, Anime, Películas y TV, Música, Deportes o Videojuegos"
        );
    }
    const exclusive: boolean = params[7].toLowerCase() === "true";

    return new Funko(
      +params[0],
      params[1],
      params[2],
      type,
      genre,
      params[5],
      +params[6],
      exclusive,
      params[8],
      +params[9]
    );
  }

  /**
   * Creates a Funko object from a correct JSON object
   * @param data The JSON object to parse
   * @returns A new Funko with the atributes of the JSON
   */
  public static funkoFromJSON(data: any): Funko {
    let type: FunkoTypes;
    switch (data._type.toLowerCase()) {
      case "pop!":
        type = FunkoTypes.POP;
        break;
      case "pop! rides":
        type = FunkoTypes.POP_RIDES;
        break;
      case "vynil soda":
        type = FunkoTypes.VYNIL_SODA;
        break;
      case "vynil gold":
        type = FunkoTypes.VYNIL_GOLD;
        break;
      default:
        throw new Error(
          "El tipo del Funko debe ser Pop!, Pop! Rides, Vynil Soda o Vynil Gold"
        );
    }
    let genre: FunkoGenres;
    switch (data._genre.toLowerCase()) {
      case "animación":
        genre = FunkoGenres.ANIMATION;
        break;
      case "anime":
        genre = FunkoGenres.ANIME;
        break;
      case "películas y tv":
        genre = FunkoGenres.MOVIES_AND_TV;
        break;
      case "música":
        genre = FunkoGenres.MUSIC;
        break;
      case "deportes":
        genre = FunkoGenres.SPORTS;
        break;
      case "videojuegos":
        genre = FunkoGenres.VIDEOGAMES;
        break;
      default:
        throw new Error(
          "El género del Funko debe ser Animación, Anime, Películas y TV, Música, Deportes o Videojuegos"
        );
    }
    return new Funko(
      data._id,
      data._name,
      data._description,
      type,
      genre,
      data._franchise,
      data._number,
      data._exclusive,
      data._characteristics,
      data._value
    );
  }
}
