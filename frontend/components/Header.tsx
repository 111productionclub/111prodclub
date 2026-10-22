import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.jpg";
import CartButton from "@/components/CartButton";

type NavItem = {
    label: string
    href: string
}
const navItems: NavItem[] = [
    { label: "Как мы работаем", href: "/#process" },
    { label: "Работы", href: "/works" },
    { label: "Купить мерч", href: "/merch" },
    { label: "Вход для клиентов", href: "/login" },
];
export default function Header() {
    return (
        <header className="flex h-32 items-center justify-between px-12">
            <Link href="/">
                <Image src={logo} alt="111 production club" width={87} height={86} preload />
            </Link>
            <nav className="flex gap-7">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="text-h3 font-medium hover:underline">
                        {item.label}
                    </Link>
                ))}
                <CartButton />
            </nav>
        </header>
    );
}