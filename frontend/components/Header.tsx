import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.jpg";
import CartButton from "@/components/CartButton";
import MobileMenu from "@/components/MobileMenu";
import { shopEnabled } from "@/lib/flags";

type NavItem = {
    label: string
    href: string
    shop?: boolean
}
const navItems: NavItem[] = [
    { label: "Как мы работаем", href: "/#process" },
    { label: "Работы", href: "/works" },
    { label: "Купить мерч", href: "/merch", shop: true },
    { label: "Вход для клиентов", href: "/login", shop: true },
];
export default function Header() {
    const items = navItems.filter((item) => shopEnabled || !item.shop);

    return (
        <header className="flex h-[84px] items-center justify-between px-5 md:h-32 md:px-12">
            <Link href="/">
                <Image src={logo} alt="111 production club" width={87} height={86} 
                    sizes="(min-width: 768px) 87px, 52px"
                    className="h-auto w-[52px] md:w-[87px]"
                    preload
                />
            </Link>
            <div className="flex items-center gap-4 md:gap-7">
                <nav aria-label="Основная навигация" className="hidden gap-7 md:flex">
                    {items.map((item) => (
                        <Link key={item.href} href={item.href} className="text-h3 font-medium hover:underline">
                            {item.label}
                        </Link>
                    ))}
                </nav>
                {shopEnabled && <CartButton />}
                <MobileMenu items={items} />
            </div>
        </header>
    );
}