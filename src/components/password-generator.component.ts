import {AbstractComponent, Component, EventListener, GlobalEventListener, OnReady} from 'iizuna';
import {PasswordGenerator} from '../password-generator';
import {Pwned} from '@iizuna/pwned-passwords/lib/utilities/pwned';

@Component({
	selector: 'password-generator',
	childrenSelectors: [
		'create',
		'generated-password',
		'copy-password',
		'not-pwnd',
		'pwnd',
		'refresh'
	]
})
export class PasswordGeneratorComponent extends AbstractComponent implements OnReady {

	/**
	 * @description
	 * Initializes a single instance if the password generator
	 */
	private generator: PasswordGenerator = new PasswordGenerator();
	private displayInput?: HTMLInputElement;

	public onReady(): void {
		this.displayInput = this.children['generated-password'][0] as HTMLInputElement;
		this.generate();
	}

	/**
	 * @description
	 * Appends a click listener to the "generate" button and triggers the password generation
	 */
	@GlobalEventListener('update-password-length update-special-chars')
	public generate(): void {
		this.displayInput.value = this.generator.generate();
		(this.children['create'][0] as HTMLElement).innerText = this.displayInput.value;
		this.updateHaveIBeenPwned();
	}


	@EventListener('click', 'create')
	public copyPassword(): void {
		this.displayInput.select();
		document.execCommand('Copy');
		this.displayInput.blur();
		this.generate();
		chrome.notifications.create(this.displayInput.value, {
			title: 'Clipboard',
			message: 'Password successfully copied',
			type: 'basic',
			iconUrl: 'icon.png'
		});
	}

	@EventListener('click', 'refresh')
	public refreshPassword(): void {
		this.generate();
	}


	/**
	 * @description
	 * Resets the have i been pwned check mark and then check whethes the password was pwnd or not
	 */
	private updateHaveIBeenPwned() {
		this.children['not-pwnd'][0].classList.add('hidden');
		this.children['pwnd'][0].classList.add('hidden');
		Pwned.haveIBeenPwned(this.displayInput.value).then((count) => {
			if (count <= 0) {
				this.children['not-pwnd'][0].classList.remove('hidden');
			} else {
				this.children['pwnd'][0].classList.remove('hidden');
			}
		});
	}
}
