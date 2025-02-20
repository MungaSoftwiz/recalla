import TextField from '@mui/material/TextField';

export function FormField({ type, placeholder, value, onChange, required = true }) {
    return (
        <div className="space-y-2">
            <TextField
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                fullWidth
            />
        </div>
    );
}