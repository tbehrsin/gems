
import Gem from './gem';
import Diamond from './diamond';
import { GlassNugget as _GlassNugget, Nugget } from './nugget';


export class BlueGem extends Gem {

  static Probability = 0.125;

  constructor() {
    super('blue-gem', 0x0000ff, 2, BlueGem.Probability);
  }
}

export class YellowGem extends Gem {

  static Probability = 0.125;

  constructor() {
    super('yellow-gem', 0xffff00, 4, YellowGem.Probability);
  }
}

export class GreenGem extends Gem {

  static Probability = 0.125;

  constructor() {
    super('green-gem', 0x00ff00, 6, GreenGem.Probability);
  }
}

export class PurpleGem extends Gem {

  static Probability = 0.125;

  constructor() {
    super('purple-gem', 0xff88ff, 8, PurpleGem.Probability);
  }
}

export class OrangeDiamond extends Diamond {

  static Probability = 0.025;

  constructor() {
    super('orange-diamond', 0xffa500, 10, OrangeDiamond.Probability);
  }
}

export class CyanDiamond extends Diamond {

  static Probability = 0.025;

  constructor() {
    super('cyan-diamond', 0x00ffff, 15, CyanDiamond.Probability);
  }
}

export class GreenDiamond extends Diamond {

  static Probability = 0.025;

  constructor() {
    super('green-diamond', 0x00ff00, 20, GreenDiamond.Probability);
  }
}

export class PinkDiamond extends Diamond {

  static Probability = 0.025;

  constructor() {
    super('pink-diamond', 0xff0088, 30, PinkDiamond.Probability);
  }
}

export class BronzeNugget extends Nugget {

  static Probability = 0.008;

  constructor() {
    super('bronze-nugget', 0xcd7f32, 75, BronzeNugget.Probability);
  }
}

export class SilverNugget extends Nugget {

  static Probability = 0.006;

  constructor() {
    super('silver-nugget', 0x888888, 100, SilverNugget.Probability);
  }
}

export class GoldNugget extends Nugget {

  static Probability = 0.004;

  constructor() {
    super('gold-nugget', 0xffd700, 200, GoldNugget.Probability);
  }
}

export class LavaNugget extends Nugget {

  static Probability = 0.002;

  constructor() {
    super('lava-nugget', 0xff0000, 500, LavaNugget.Probability);
  }
}

export class NuclearNugget extends Nugget {

  static Probability = 0.001;

  constructor() {
    super('nuclear-nugget', 0x0000ff, 1000, NuclearNugget.Probability);
  }
}

export const GlassNugget = _GlassNugget;


export function NextTiles(...tiles) {
  let sum = tiles.reduce((a, b) => a + b.Probability, 0);
  let rand = sum * Math.random();
  for(var i = 0; rand > 0 && i < tiles.length; i++) rand -= tiles[i].Probability;
  return tiles[i - 1];
}

export function NextTile() {
  return NextTiles(BlueGem, YellowGem, GreenGem, PurpleGem, OrangeDiamond, CyanDiamond, GreenDiamond, PinkDiamond, GlassNugget, BronzeNugget, SilverNugget, GoldNugget, LavaNugget, NuclearNugget);
};

export function NextGem() {
  return NextTiles(BlueGem, YellowGem, GreenGem, PurpleGem);
};

export function NextGemOrDiamond() {
  return NextTiles(BlueGem, YellowGem, GreenGem, PurpleGem, OrangeDiamond, CyanDiamond, GreenDiamond, PinkDiamond);
};

export function NextGemDiamondOrNugget() {
  return NextTiles(BlueGem, YellowGem, GreenGem, PurpleGem, OrangeDiamond, CyanDiamond, GreenDiamond, PinkDiamond, GlassNugget, BronzeNugget, SilverNugget, GoldNugget, LavaNugget, NuclearNugget);
}
