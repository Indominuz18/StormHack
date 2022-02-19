import TextField from "$app/components/input/TextField";

export default function PasswordField(props: TextField.Props) {
	return TextField({...props, _x_isPassword: true});
}
