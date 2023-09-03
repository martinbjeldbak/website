---
title: Building an OpnSense Router
categories: [thoughts, homelab]
pubDate: 2023-08-18
description: First post on the blog on how it's been rewritten with Astro and reasonings behind
relatedPosts: []
draft: true
---

In 2021, I bought a Synology DS912+ as my storage needs expanded. Little did I know, this started me down a longer path of home automation and networking. Since then my home network has grown in devices and complexity.

One of the items on my home network improvement list is to replace my Netgear Nighthawk R7000P Dual-band wifi router with a home built one for the many benefits of having your own router: security, fun, and performance. I had already installed DD-WRT and removed the wifi antennas from the R7000P after switching over to some Ubiquiti U6-lite mesh nodes, since our wifi coverage was not great.

This article is mostly to document my journey. Maybe this is useful for someone else too!

Main goal is to get started using OPNsense, then build on top with cool features like firewalls, traffic shaping, VLANs, etc.

```
```

## Hardware

I'll keep this section short since there are an abundance of options to pick from.

### Router

You can pick any x64-based hardware. In my case, I picked up a Queensland government-used HP EliteDesk G3 800 with an Intel i5-6500 running at 3.2GHz for AUD $1xx.00 on eBay. I had some old laptop RAM laying around and upgraded the memory from 8GB to 16GB, too. Because why not.

### NIC

The EliteDesk G3 800 has an A+E keyed M.2 slot, normally used by wifi cards. Mine didn't come with one so it was free (see picture below). It's only recently that I learned this slot can actually be used for [heaps of purposes][m.2], one of which is as a network card!

Most people recommend Intel, but I couldn't find an A+E key'ed M.2 Intel NIC delivered cheaply here in Australia, so I ended up getting a Realtek RTL8125 NIC from AlieEpress.

To get this NIC working, I needed to install the `os-realtek-re` package from Opnsense System > Firmware. I used the onboard Intel NIC meantime.

## OPNSense Configuration

The main router options are: pfSense, and Opnsense. Opnsense is a fork of pfSense and seems to be updated more often. Both are FreeBSD-based.

### DHCP

#### DHCPv4
Tick Enable
Available range: 192.168.1.2 - 192.168.1.150

### Firewall Rules: LAN

#### Rules

Below are the rules I've added to harden my network. All are optional.

##### Limit DNS to internal lookups only

This rule blocks all requests from internal hosts to any DNS servers other than internal DNS servers running on port 53

| -- | -- |
| Action | Pass |
| Interface | LAN |
| Direction | in |
| TCP/IP Version | IPv4 |
| Protocol | TCP/UDP |
| Source | any |
| Destination | LAN address |
| Destination port range | DNS |
| Description | Allow internal DNS |

Create another rule below this to block external DNS lookups with settings as follows

| -- | -- |
| Action | Block |
| Interface | LAN |
| Direction | in |
| TCP/IP Version | IPv4 |
| Protocol | TCP/UDP |
| Source | any |
| Destination | any |
| Destination port range | DNS |
| Description | Block external DNS |


### Unbound DNS: General

Tick Enable
Enable DNSSEC Support tick
Register DHCP Leases tick
Register DHCP Static Mappings tick
Flush DNS Cache during reload tick


### VLANs

Inspired by Michael Schnerring's post [here][schnerring-2], I'm splitting the VLANs up by the third octet of the VLAN ID. Below are the VLANs I'm going with:

| -- | -- |
| Description | ID | Subnet |
| Native | 1 | 192.168.**1**.0/24 |
| Management | 10 | 192.168.**10**.0/24 |
| VPN | 20 | 192.168.**20**.0/24 |
| Clear | 30 | 192.168.**30**.0/24 |
| Guest | 40 | 192.168.**40**.0/24 |

### Cloud Backup

Don't skip this one! There are many ways to back up the router configuration. I've chosen to backup settings to Google Drive, simply as it's easiest. In the future, I'll consider backing up using `git`.

See https://docs.opnsense.org/manual/how-tos/cloud_backup.html for backup

## Other configuration

### Configure OPNsense DHCP to use internal DNS server

I use Adguard Home as a DNS server on my internal network, hosted on my Synology NAS. This is also applicable to Pi-hole and other DNS servers. Navigate to

Navigate to
```
 Opnsense > System > Settings > General
```
Ensure DNS Servers is empty
Uncheck `Do not use the local DNS service as a nameserver for this system`
Uncheck `Allow DNS server list to be overridden by DHCP/PPP on WAN`

```
Services > Unbound DNS > General
```
Check `Enable Unbound`
Listen port `5353` (in order not to confuse with Adguard Home DNS port 53)
Network Interfaces `All`
Check `Enable DNSSEC Support``
Check any other relevant settings
Scroll down, hit apply

```
Services > DHCPv4 > [LAN]
```
Set IP address of Adguard Home in `DNS servers`. 192.168.1.200 in my case.
Scroll down and hit Save to apply.

```
Opnsense > Services > Unbound > Dns Over Tls
```
Under `Custom forwarding`, click the `+` button
Server IP `1.1.1.1`
Server port `853`
Verify CN `cloudflare-dns.com`
Click Save in modal
Click Apply

**Now switching to Adguard Home UI**

Navigte to `Settings > DNS settings`

In section `Upstream DNS servers`
Add Opnsense ip:5353  (192.168.1.1:5353), and delete any that exist

In section `Bootstrap DNS servers`
Add Opnsense ip:5353  (192.168.1.1:5353), and delete any that exist

In section `Private reverse DNS servers`
Add Opnsense ip:5353  (192.168.1.1:5353), and delete any that exist

## Troubleshooting

### No internet access

While testing the OPNsense setup, I added my existing router as a "gateway" in Systems > Gateways > Single alongside the WAN one. This allowed LAN access between hosts, but all hosts on the network were unable to connect to the internet via the WAN gateway.

Solution: simply removing the existing router as a Gateway instantly fixed it.

## Things you can now do!

So many options - here are a few I've done. I may write about this to go into further detail, but mostly I've followed these to the point.

- [Create Unbound DNS Overrides for your reverse proxy](https://homenetworkguy.com/how-to/create-unbound-dns-override-aliases-in-opnsense/)
- [Set up Adguard Home on your router](https://0x2142.com/how-to-set-up-adguard-on-opnsense/)
- [Set up Dynamic DNS with ddclient](https://docs.opnsense.org/manual/dynamic_dns.html)
- Enable port forwarding for Plex/Caddy/etc. via Cloudflare proxying securely using Cloudflare IP allowlist on OPNSense
- [Set up blocklist to block malicious IPs](https://www.allthingstech.ch/using-opnsense-and-ip-blocklists-to-block-malicious-traffic)
    - [More lists on Reddit](https://www.reddit.com/r/pfBlockerNG/comments/9t1w6o/pfblockerngdevel_feed_feedback/)
    - [Firehol blocklist](https://iplists.firehol.org/) no longer seems to be updated as of August 2023
- [Set up The Intrusion Prevention System (IPS) system for deep packet inspection](https://docs.opnsense.org/manual/ips.html)
- [Set up GeoIP for country-specific allowing/blocking](https://docs.opnsense.org/manual/how-tos/maxmind_geo_ip.html)
- [Set up your OPNSense as a Wireguard server with os-wireguard](https://docs.opnsense.org/manual/how-tos/wireguard-client.html) for VPN server on your router
- [Replace the OPNsense Web UI Self-Signed Certificate with a Let's Encrypt Certificate](https://homenetworkguy.com/how-to/replace-opnsense-web-ui-self-signed-certificate-with-lets-encrypt/)

## TODO

- MD links for pfsense, r7000p, u6-lite



## Resources

- https://schnerring.net/blog/opnsense-baseljine-guide-with-vpn-guest-and-vlan-support
- https://schnerring.net/blog/router-on-a-stick-vlan-configuration-with-swos-on-the-mikrotik-crs328-24p-4s+rm-switch/
- https://www.youtube.com/watch?v=_IzyJTcnPu8
- https://forum.opnsense.org/index.php?topic=22162.msg146626#msg146626
- Home Network Guy has great, detailed video video: https://www.youtube.com/watch?v=h2_cQxTkh3Q

[m.2]: https://www.youtube.com/watch?v=4TsJ7t7IBiw
[schnerring-2]: https://schnerring.net/blog/router-on-a-stick-vlan-configuration-with-swos-on-the-mikrotik-crs328-24p-4s+rm-switch/
[self-hosted]: https://github.com/martinbjeldbak/self-hosted