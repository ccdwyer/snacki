import { useAugmentedRef } from '@rn-primitives/hooks';
import { Icon } from '@roninoss/icons';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { AlertProps, AlertRef } from './types';

import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { TextField } from '~/components/nativewindui/TextField';
import { TextFieldRef } from '~/components/nativewindui/TextField/types';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

const Alert = React.forwardRef<AlertRef, AlertProps>(
    (
        {
            children,
            title: titleProp,
            message: messageProp,
            buttons: buttonsProp,
            prompt: promptProp,
            materialIcon: materialIconProp,
            materialWidth: materialWidthProp,
            materialPortalHost,
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false);
        const [{ title, message, buttons, prompt, materialIcon, materialWidth }, setProps] =
            React.useState<AlertProps>({
                title: titleProp,
                message: messageProp,
                buttons: buttonsProp,
                prompt: promptProp,
                materialIcon: materialIconProp,
                materialWidth: materialWidthProp,
            });
        const [text, setText] = React.useState(promptProp?.defaultValue ?? '');
        const [password, setPassword] = React.useState('');
        const { colors } = useColorScheme();
        const passwordRef = React.useRef<TextFieldRef>(null);
        const dialogRef = React.useRef<HTMLDialogElement>(null);
        const augmentedRef = useAugmentedRef({
            ref,
            methods: {
                show: () => {
                    setOpen(true);
                    dialogRef.current?.showModal();
                },
                alert,
                prompt: promptAlert,
            },
        });

        function promptAlert(args: AlertProps & { prompt: Required<AlertProps['prompt']> }) {
            setText(args.prompt?.defaultValue ?? '');
            setPassword('');
            setProps(args);
            setOpen(true);
            dialogRef.current?.showModal();
        }

        function alert(args: AlertProps) {
            setText(args.prompt?.defaultValue ?? '');
            setPassword('');
            setProps(args);
            setOpen(true);
            dialogRef.current?.showModal();
        }

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
                    {prompt ? (
                        <div className="flex flex-col gap-4 pb-8">
                            <TextField
                                autoFocus
                                labelClassName="bg-card"
                                keyboardType={
                                    prompt.type === 'secure-text' ? 'default' : prompt.keyboardType
                                }
                                label={prompt.type === 'login-password' ? 'Email' : ''}
                                secureTextEntry={prompt.type === 'secure-text'}
                                value={text}
                                onChangeText={setText}
                                onSubmitEditing={() => {
                                    if (prompt.type === 'login-password' && passwordRef.current) {
                                        passwordRef.current.focus();
                                        return;
                                    }
                                    for (const button of buttons) {
                                        if (!button.style || button.style === 'default') {
                                            button.onPress?.(text);
                                        }
                                    }
                                    onOpenChange(false);
                                }}
                                blurOnSubmit={prompt.type !== 'login-password'}
                            />
                            {prompt.type === 'login-password' && (
                                <TextField
                                    ref={passwordRef}
                                    labelClassName="bg-card"
                                    keyboardType={prompt.keyboardType}
                                    defaultValue={prompt.defaultValue}
                                    label="Password"
                                    secureTextEntry={prompt.type === 'login-password'}
                                    value={password}
                                    onChangeText={setPassword}
                                    onSubmitEditing={() => {
                                        for (const button of buttons) {
                                            if (!button.style || button.style === 'default') {
                                                button.onPress?.(text);
                                            }
                                        }
                                        onOpenChange(false);
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="h-0.5" />
                    )}
                    <div
                        className={cn(
                            'flex flex-row items-center justify-end gap-0.5',
                            buttons.length > 2 && 'justify-between'
                        )}>
                        {buttons.map((button, index) => {
                            if (button.style === 'cancel') {
                                return (
                                    <div
                                        key={`${button.text}-${index}`}
                                        className={cn(
                                            buttons.length > 2 &&
                                                index === 0 &&
                                                'flex-1 items-start'
                                        )}>
                                        <Button
                                            variant="plain"
                                            onPress={() => {
                                                button.onPress?.(
                                                    prompt?.type === 'login-password'
                                                        ? {
                                                              login: text,
                                                              password,
                                                          }
                                                        : text
                                                );
                                                onOpenChange(false);
                                            }}>
                                            <Text className="text-[14px] font-medium text-primary">
                                                {button.text}
                                            </Text>
                                        </Button>
                                    </div>
                                );
                            }
                            if (button.style === 'destructive') {
                                return (
                                    <div
                                        key={`${button.text}-${index}`}
                                        className={cn(
                                            buttons.length > 2 &&
                                                index === 0 &&
                                                'flex-1 items-start'
                                        )}>
                                        <Button
                                            variant="tonal"
                                            className="bg-destructive/10 dark:bg-destructive/25"
                                            onPress={() => {
                                                button.onPress?.(
                                                    prompt?.type === 'login-password'
                                                        ? {
                                                              login: text,
                                                              password,
                                                          }
                                                        : text
                                                );
                                                onOpenChange(false);
                                            }}>
                                            <Text className="text-[14px] font-medium text-foreground">
                                                {button.text}
                                            </Text>
                                        </Button>
                                    </div>
                                );
                            }
                            return (
                                <div
                                    key={`${button.text}-${index}`}
                                    className={cn(
                                        buttons.length > 2 && index === 0 && 'flex-1 items-start'
                                    )}>
                                    <Button
                                        variant="plain"
                                        onPress={() => {
                                            button.onPress?.(
                                                prompt?.type === 'login-password'
                                                    ? { login: text, password }
                                                    : text
                                            );
                                            onOpenChange(false);
                                        }}>
                                        <Text className="text-[14px] font-medium text-primary">
                                            {button.text}
                                        </Text>
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </dialog>
        );

        return (
            <>
                {children}
                {typeof window !== 'undefined' &&
                    createPortal(
                        dialog,
                        materialPortalHost
                            ? document.querySelector(materialPortalHost) || document.body
                            : document.body
                    )}
            </>
        );
    }
);

Alert.displayName = 'Alert';

const AlertAnchor = React.forwardRef<AlertRef>((_, ref) => {
    return <Alert ref={ref} title="" buttons={[]} />;
});

AlertAnchor.displayName = 'AlertAnchor';

export { Alert, AlertAnchor };
