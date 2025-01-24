import { Icon } from '@roninoss/icons';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { AlertProps, AlertRef } from './types';

import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';
import { TextField } from '~/components/nativewindui/TextField';
import { TextFieldRef } from '~/components/nativewindui/TextField/types';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

const AlertComponent: React.ForwardRefRenderFunction<AlertRef, AlertProps> = (props, ref) => {
    const {
        children,
        title: titleProp,
        message: messageProp,
        buttons: buttonsProp,
        prompt: promptProp,
        materialIcon: materialIconProp,
        materialWidth: materialWidthProp,
        materialPortalHost,
    } = props;

    const [open, setOpen] = React.useState(false);
    const [{ title, message, buttons, prompt, materialIcon, materialWidth }, setProps] =
        React.useState<AlertProps>({
            title: titleProp,
            message: messageProp,
            buttons: buttonsProp ?? [{ text: 'OK', style: 'cancel' }],
            prompt: promptProp,
            materialIcon: materialIconProp,
            materialWidth: materialWidthProp,
        });
    const [text, setText] = React.useState(promptProp?.defaultValue ?? '');
    const [password, setPassword] = React.useState('');
    const { colors } = useColorScheme();
    const passwordRef = React.useRef<TextFieldRef>(null);
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    // Define alert functions
    function show() {
        setOpen(true);
        dialogRef.current?.showModal();
    }

    function alert(args: AlertProps) {
        setProps(args);
        setOpen(true);
        dialogRef.current?.showModal();
    }

    function promptAlert(args: AlertProps & { prompt: Required<AlertProps['prompt']> }) {
        setProps(args);
        setText(args.prompt?.defaultValue ?? '');
        setOpen(true);
        dialogRef.current?.showModal();
    }

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
        show,
        alert,
        prompt: promptAlert,
    }));

    function onOpenChange(open: boolean) {
        if (!open) {
            setText(prompt?.defaultValue ?? '');
            setPassword('');
            dialogRef.current?.close();
        }
        setOpen(open);
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const dialogDimensions = dialogRef.current?.getBoundingClientRect();
        if (dialogDimensions) {
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                onOpenChange(false);
            }
        }
    };

    const dialog = (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className={cn(
                'backdrop:bg-popover/80 fixed inset-0 z-50 m-0 h-screen w-screen bg-transparent p-0 backdrop:backdrop-blur-sm',
                !open && 'pointer-events-none opacity-0'
            )}>
            <div
                style={typeof materialWidth === 'number' ? { width: materialWidth } : undefined}
                className={cn(
                    'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-card p-6 shadow-lg duration-200 sm:rounded-lg',
                    'min-w-72 max-w-xl rounded-3xl pt-7'
                )}>
                {!!materialIcon && (
                    <div className="flex items-center justify-center pb-4">
                        <Icon color={colors.foreground} size={27} {...materialIcon} />
                    </div>
                )}
                {message ? (
                    <>
                        <div>
                            <Text
                                variant="title2"
                                className={cn(!!materialIcon && 'text-center', 'pb-4')}>
                                {title}
                            </Text>
                        </div>
                        <div>
                            <Text variant="subhead" className="pb-4 opacity-90">
                                {message}
                            </Text>
                        </div>
                    </>
                ) : materialIcon ? (
                    <div>
                        <Text
                            variant="title2"
                            className={cn(!!materialIcon && 'text-center', 'pb-4')}>
                            {title}
                        </Text>
                    </div>
                ) : (
                    <div>
                        <Text variant="subhead" className="pb-4 opacity-90">
                            {title}
                        </Text>
                    </div>
                )}
                {prompt && (
                    <div className="flex flex-col gap-2">
                        <TextField
                            value={text}
                            onChangeText={setText}
                            placeholder={prompt.type === 'login-password' ? 'Login' : undefined}
                            keyboardType={prompt.keyboardType}
                            autoFocus
                        />
                        {prompt.type === 'login-password' && (
                            <TextField
                                ref={passwordRef}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                                secureTextEntry
                            />
                        )}
                    </div>
                )}
                <div
                    className={cn(
                        'flex flex-row items-center justify-end gap-0.5',
                        buttons.length > 2 && 'justify-between'
                    )}>
                    {buttons.map((button, index) => {
                        if (button.style === 'cancel') {
                            return (
                                <Button
                                    key={index}
                                    onPress={() => {
                                        button.onPress?.(
                                            prompt?.type === 'login-password'
                                                ? { login: text, password }
                                                : text
                                        );
                                        onOpenChange(false);
                                    }}
                                    variant="secondary">
                                    <Text>{button.text}</Text>
                                </Button>
                            );
                        }
                        return (
                            <Button
                                key={index}
                                onPress={() => {
                                    button.onPress?.(
                                        prompt?.type === 'login-password'
                                            ? { login: text, password }
                                            : text
                                    );
                                    onOpenChange(false);
                                }}>
                                <Text>{button.text}</Text>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </dialog>
    );

    return materialPortalHost && typeof document !== 'undefined'
        ? createPortal(dialog, document.getElementById(materialPortalHost) ?? document.body)
        : dialog;
};

export const Alert = React.forwardRef(AlertComponent);
Alert.displayName = 'Alert';

export const AlertAnchor = Alert;
