import {ComponentFactory} from 'iizuna';
import {SliderComponent} from './components/slider.component';
import {PasswordGeneratorComponent} from './components/password-generator.component';
import {SpecialCharComponent} from './components/special-char.component';
import {EntropyBitsComponent} from './components/entropy-bits.component';

ComponentFactory.registerComponents([
	SliderComponent,
	PasswordGeneratorComponent,
	SpecialCharComponent,
	EntropyBitsComponent
]);
